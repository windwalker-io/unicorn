<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Storage;

use Aws\AwsClient;
use Aws\CloudFront\CloudFrontClient;
use Aws\CommandInterface;
use Aws\Credentials\Credentials;
use Aws\Middleware;
use Aws\ResultInterface;
use Aws\S3\S3Client;
use Composer\CaBundle\CaBundle;
use League\Flysystem\Filesystem;
use Psr\Http\Message\RequestInterface;
use Symfony\Component\Mime\MimeTypesInterface;
use Unicorn\Aws\S3Service;
use Unicorn\Storage\Adapter\LocalStorage;
use Unicorn\Storage\Adapter\S3Storage;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Application\PathResolver;
use Windwalker\DI\Container;
use Windwalker\Filesystem\Path;
use Windwalker\Uri\Uri;
use Windwalker\Uri\UriNormalizer;

use function Windwalker\tid;

/**
 * The StorageFactory class.
 */
class StorageFactory
{
    /**
     * StorageFactory constructor.
     */
    public function __construct(protected Container $container)
    {
    }

    public function localStorage(array $options = []): LocalStorage
    {
        return new LocalStorage(
            $this->container->get(ApplicationInterface::class),
            $options
        );
    }

    public function s3Storage(array $options = []): S3Storage
    {
        return new S3Storage(
            $this->s3Service($options),
            $this->container->get(MimeTypesInterface::class)
        );
    }

    public function s3Service(array $options = []): S3Service {
        $s3Client = $this->s3Client($options);

        return new S3Service($s3Client, $options);
    }

    public function s3Client(array $options = []): S3Client
    {
        $credentials = $options['credentials']
            ?? new Credentials($options['access_key'] ?? '', $options['secret'] ?? '');

        $options['credentials'] = $credentials;
        $options['region'] ??= $this->container->getParam('storage.s3.default_region');
        $options['endpoint'] ??= 'https://s3.amazonaws.com';
        $options['version'] ??= 'latest';
        $options['http'] ??= [
            'verify' => CaBundle::getBundledCaBundlePath(),
        ];

        $s3 = new S3Client($options);

        $s3->getHandlerList()->appendInit(
            function (callable $handler) use ($s3, $options) {
                return function (CommandInterface $command, RequestInterface $request = null) use ($s3, $handler, $options) {
                    $args = $options['args'] ?? [];

                    if (!isset($command['Bucket'])) {
                        $command['Bucket'] = $options['bucket'];
                    }

                    $subfolder = $options['subfolder'] ?? '';
                    $fullKey = $key = $command['Key'] ?? null;

                    if ($key !== null) {
                        $command['Key'] = $fullKey = ltrim(
                            UriNormalizer::cleanPath($subfolder . '/' . $command['Key']),
                            '/'
                        );
                    }

                    $command['Prefix'] = ltrim(
                        UriNormalizer::cleanPath($subfolder . '/' . $command['Prefix'],),
                        '/'
                    );

                    foreach ($args as $k => $v) {
                        $command[$k] = $command[$k] ?? $v;
                    }

                    return $handler($command, $request)
                        ->then(
                            function (ResultInterface $result) use ($s3, $options, $key, $fullKey) {
                                if ($key !== null && isset($options['cdn']['root'])) {
                                    $result['S3URL'] = $result['ObjectURL'];
                                    $result['ObjectURL'] = $options['cdn']['root'] . '/' . $key;

                                    $provider = strtolower($options['cdn']['provider'] ?? '');

                                    // Clear CDN Cache
                                    if ($provider === 'cloudfront' && !empty($options['cdn']['auto_clear_cache'])) {
                                        $cfc = new CloudFrontClient(
                                            [
                                                'credentials' => $s3->getCredentials()->wait(),
                                                'region' => $s3->getRegion(),
                                                'version' => 'latest'
                                            ]
                                        );

                                        $cfc->createInvalidation(
                                            [
                                                'DistributionId' => self::getCloudfrontDistId($options['cdn']),
                                                'InvalidationBatch' => [
                                                    'CallerReference' => tid(),
                                                    'Paths' => [
                                                        'Items' => [$fullKey],
                                                        'Quantity' => 1,
                                                    ],
                                                ]
                                            ]
                                        );
                                    }
                                }

                                return $result;
                            }
                        );
                };
            }
        );

        return $s3;
    }

    public function flysystem(
        callable $adapterFactory,
    ): Filesystem {
        $adapter = $this->container->resolve($adapterFactory);

        return new Filesystem($adapter);
    }

    protected static function getCloudfrontDistId(array $cdnOptions): ?string
    {
        if (isset($cdnOptions['id'])) {
            return $cdnOptions['id'];
        }

        $url = new Uri($cdnOptions['root'] ?? '');
        $host = explode('.', $url->getHost());

        return array_shift($host);
    }
}

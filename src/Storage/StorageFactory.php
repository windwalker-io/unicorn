<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Storage;

use Aws\CommandInterface;
use Aws\Credentials\Credentials;
use Aws\Middleware;
use Aws\S3\S3Client;
use Composer\CaBundle\CaBundle;
use League\Flysystem\Filesystem;
use Unicorn\Aws\S3Service;
use Unicorn\Storage\Adapter\LocalStorage;
use Unicorn\Storage\Adapter\S3Storage;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Application\PathResolver;
use Windwalker\DI\Container;
use Windwalker\Filesystem\Path;

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
        return new S3Storage($this->s3Service($options));
    }

    public function s3Service(array $options = []): S3Service {
        $s3Client = $this->s3Client($options);

        return new S3Service($s3Client, $options);
    }

    public function s3Client(array $options = []): S3Client
    {
        $credentials = new Credentials($options['access_key'] ?? '', $options['secret'] ?? '');

        $options['credentials'] = $credentials;
        $options['region'] ??= $this->container->getParam('storage.s3.default_region');
        $options['endpoint'] ??= 'https://s3.amazonaws.com';
        $options['version'] ??= 'latest';
        $options['http'] ??= [
            'verify' => CaBundle::getBundledCaBundlePath(),
        ];

        $s3 = new S3Client($options);

        $s3->getHandlerList()->appendInit(
            Middleware::mapCommand(
                static function (CommandInterface $command) use ($options) {
                    $args = $options['args'] ?? [];

                    if (!isset($command['Bucket'])) {
                        $command['Bucket'] = $options['bucket'];
                    }

                    $subfolder = $options['subfolder'] ?? '';

                    if (isset($command['Key'])) {
                        $command['Key'] = ltrim(
                            Path::clean(
                                $subfolder . '/' . $command['Key'],
                                '/'
                            ),
                            '/'
                        );
                    }

                    $command['Prefix'] = ltrim(
                        Path::clean(
                            $subfolder . '/' . $command['Prefix'],
                            '/'
                        ),
                        '/'
                    );

                    foreach ($args as $k => $v) {
                        $command[$k] = $v;
                    }

                    return $command;
                }
            )
        );

        return $s3;
    }

    public function flysystem(
        callable $adapterFactory,
    ): Filesystem {
        $adapter = $this->container->resolve($adapterFactory);

        return new Filesystem($adapter);
    }
}

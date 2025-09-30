<?php

declare(strict_types=1);

namespace Unicorn\Script;

use Aws\S3\PostObjectV4;
use Unicorn\Aws\S3Service;
use Unicorn\Storage\Adapter\S3Storage;
use Unicorn\Storage\StorageInterface;
use Unicorn\Storage\StorageManager;
use Windwalker\Core\Asset\AbstractScript;
use Windwalker\DI\Container;
use Windwalker\DI\Exception\DefinitionNotFoundException;
use Windwalker\DI\Exception\DependencyResolutionException;

/**
 * The AwsScript class.
 */
class AwsScript extends AbstractScript
{
    /**
     * AwsScript constructor.
     */
    public function __construct(
        protected UnicornScript $unicornScript,
        protected Container $container
    ) {
    }

    /**
     * @param  string  $name
     * @param  string  $acl
     * @param  array{
     *      profile?: string,
     *      s3Service?: S3Service,
     *      starts_with?: array<string, string>,
     *  }   $options
     *
     * @return  void
     *
     * @throws DefinitionNotFoundException
     * @throws DependencyResolutionException
     */
    public function s3BrowserUploader(
        string $name,
        string $acl = S3Service::ACL_PUBLIC_READ,
        array $options = []
    ): void {
        if ($this->available($name)) {
            if (!class_exists(PostObjectV4::class)) {
                throw new \DomainException('Please install aws/aws-sdk-php ^3.0');
            }

            $options = static::mergeOptions(
                [
                    'starts_with' => [
                        'key' => '',
                        'Content-Type' => '',
                        'Content-Disposition' => '',
                    ],
                ],
                $options
            );

            if ($options['s3Service'] ?? null) {
                $s3 = $options['s3Service'];
            } else {
                $profile = $options['profile'] ?? 's3';
                $storage = $this->container->get(StorageInterface::class, tag: $profile);

                if (!$storage instanceof S3Storage) {
                    throw new \DomainException("Storage profile \"{$profile}\" must be S3Storage.");
                }

                $s3 = $storage->getS3Service();
            }

            /** @var S3Service $s3 */
            $bucket = $s3->getBucketName();
            $subfolder = $s3->getSubfolder();
            $endpoint = $s3->getHost(false)->__toString();

            $conditions = [
                ['bucket' => $s3->getBucketName()],
                ['acl' => $acl],
            ];

            $defaultInputs = [
                'bucket' => $s3->getBucketName(),
                'acl' => $acl,
            ];

            foreach ($options['starts_with'] as $key => $value) {
                $conditions[] = ['starts-with', '$' . $key, $value];
                $defaultInputs[$key] = '';
            }

            $postObject = new PostObjectV4(
                $s3->getClient(),
                $bucket,
                $defaultInputs,
                $conditions,
                '+2hours'
            );

            $formInputs = $postObject->getFormInputs();
            $formAttributes = $postObject->getFormAttributes();

            $viewerHost = rtrim((string) $s3->getViewerHost(), '/');

            $optionString = static::getJSObject(
                $options,
                compact(
                    'endpoint',
                    'subfolder',
                    'formInputs',
                    'viewerHost',
                    'formAttributes',
                )
            );

            $this->unicornScript->importMainThen(
                <<<JS
                u.data('@s3.uploader.{$name}', $optionString);
                JS
            );
        }
    }
}

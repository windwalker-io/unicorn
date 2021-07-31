<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Script;

use Aws\S3\PostObjectV4;
use Unicorn\Aws\S3Service;
use Windwalker\Core\Asset\AbstractScript;

/**
 * The AwsScript class.
 */
class AwsScript extends AbstractScript
{
    /**
     * AwsScript constructor.
     */
    public function __construct(protected S3Service $s3, protected UnicornScript $unicornScript)
    {
    }

    public function s3BrowserUploader(
        string $name,
        string $acl = S3Service::ACL_PUBLIC_READ,
        array $options = []
    ) {
        if ($this->available(get_defined_vars())) {
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

            $s3 = $this->s3;

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

            $viewerHost = (string) $s3->getViewerHost();

            $optionString = static::getJSObject(
                $options,
                compact(
                    'endpoint',
                    'subfolder',
                    'formInputs',
                    'viewerHost'
                )
            );

            $this->unicornScript->importMainThen(
                <<<JS
                u.import('@unicorn/aws/s3-uploader.js').then(function (module) {
                  S3Uploader.getInstance('$name', $optionString);
                });
                JS
            );
        }
    }
}
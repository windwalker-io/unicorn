<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Flysystem;

use Aws\Credentials\Credentials;
use Aws\S3\S3Client;
use Composer\CaBundle\CaBundle;
use League\Flysystem\AwsS3V3\AwsS3V3Adapter;
use League\Flysystem\AwsS3V3\PortableVisibilityConverter;
use League\Flysystem\Visibility;
use Windwalker\DI\Container;

/**
 * The FlysystemFactory class.
 */
class FlysystemFactory
{
    /**
     * FlysystemFactory constructor.
     */
    public function __construct(protected Container $container)
    {
    }

    public function s3v3Adapter(array $options): AwsS3V3Adapter
    {
        $credentials = new Credentials($options['access_key'] ?? '', $options['secret'] ?? '');

        $options['credentials'] = $credentials;
        $options['region'] ??= $this->container->getParam('storage.s3.default_region');
        $options['endpoint'] ??= 'https://s3.amazonaws.com';
        $options['version'] ??= 'latest';
        $options['http'] ??= [
            'verify' => CaBundle::getBundledCaBundlePath(),
        ];

        $client = new S3Client($options);

        return new AwsS3V3Adapter(
            $client,
            $options['bucket'] ?? '',
            $options['subfolder'] ?? '',
            new PortableVisibilityConverter(
                $options['acl'] ?? Visibility::PUBLIC
            )
        );
    }
}

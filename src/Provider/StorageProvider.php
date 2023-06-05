<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Provider;

use Unicorn\Aws\S3Service;
use Unicorn\Flysystem\FlysystemFactory;
use Unicorn\Storage\StorageFactory;
use Unicorn\Storage\StorageManager;
use Unicorn\Upload\FileUploadManager;
use Unicorn\Upload\FileUploadService;
use Windwalker\DI\Container;
use Windwalker\DI\ServiceProviderInterface;

/**
 * The StorageProvider class.
 */
class StorageProvider implements ServiceProviderInterface
{
    public function register(Container $container): void
    {
        $container->prepareSharedObject(StorageManager::class);
        $container->prepareSharedObject(StorageFactory::class);
        $container->prepareSharedObject(FlysystemFactory::class);
        $container->bind(
            FileUploadService::class,
            function (Container $container) {
                return $container->get(FileUploadManager::class)->get();
            }
        );
    }
}

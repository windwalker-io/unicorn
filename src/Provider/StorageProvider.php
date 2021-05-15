<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Provider;

use Unicorn\Flysystem\FlysystemFactory;
use Unicorn\Storage\StorageFactory;
use Unicorn\Storage\StorageManager;
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
    }
}

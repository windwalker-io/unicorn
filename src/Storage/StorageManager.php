<?php

declare(strict_types=1);

namespace Unicorn\Storage;

use Windwalker\Core\Manager\AbstractManager;
use Windwalker\Session\Session;

/**
 * The StorageManager class.
 *
 * @method StorageInterface create(?string $name = null, ...$args)
 * @method StorageInterface get(?string $name = null, ...$args)
 */
class StorageManager extends AbstractManager
{
    public function getConfigPrefix(): string
    {
        return 'storage';
    }
}

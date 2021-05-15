<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Storage;

use Windwalker\Core\Manager\AbstractManager;

/**
 * The StorageManager class.
 */
class StorageManager extends AbstractManager
{
    public function getConfigPrefix(): string
    {
        return 'storage';
    }
}

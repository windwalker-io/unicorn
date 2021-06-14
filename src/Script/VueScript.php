<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Asset\AbstractScript;

/**
 * The VueScript class.
 */
class VueScript extends AbstractScript
{
    public int $currentVersion = 3;

    public function vue(int $version = 3): void
    {
        $this->asset->js('@vue');
    }
}

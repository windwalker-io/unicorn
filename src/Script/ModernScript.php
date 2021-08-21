<?php

/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Asset\AbstractScript;

/**
 * The ModernJSScript class.
 */
class ModernScript extends AbstractScript
{
    public function ie(): void
    {
        $this->asset->js('@core-js');
        $this->asset->js('@current-script-polyfill');
    }
}

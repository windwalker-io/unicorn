<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
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

        if ($version === 2) {
            $this->compositionAPI();
        }
    }

    public function compositionAPI(): void
    {
        if ($this->available()) {
            $this->js('vendor/@vue/composition-api/dist/vue-composition-api.js');
        }
    }
}

<?php

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
        if ($version === 2) {
            $this->asset->js('vendor/vue/dist/vue.min.js');
        } else {
            $this->asset->js('@vue');
        }
    }

    public function compositionAPI(): void
    {
        if ($this->available()) {
            $this->js('vendor/@vue/composition-api/dist/vue-composition-api.js');
        }
    }

    public function draggable(): void
    {
        if ($this->available()) {
            $this->js('@sortablejs');
            $this->js('@vuedraggable');
        }
    }

    public function animate(): void
    {
        if ($this->available()) {
            if ($this->next) {
                $this->css('@vue-animate');
            } else {
                $this->css('@vue2-animate');
            }
        }
    }
}

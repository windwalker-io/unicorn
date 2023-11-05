<?php

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Asset\AbstractScript;

/**
 * The ModernJSScript class.
 */
class ModernScript extends AbstractScript
{
    public function __construct(protected UnicornScript $unicornScript)
    {
    }

    public function ie(): static
    {
        $this->asset->js('@core-js');
        $this->asset->js('@current-script-polyfill');

        return $this;
    }

    public function webComponentPolyfill(): static
    {
        $this->unicornScript->importMainThen('u.$ui.webComponentPolyfill()');

        return $this;
    }
}

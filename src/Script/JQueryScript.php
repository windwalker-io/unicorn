<?php

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Asset\AbstractScript;

/**
 * The JQueryScript class.
 */
class JQueryScript extends AbstractScript
{
    public function jquery(): static
    {
        if ($this->available()) {
            $this->js('vendor/jquery/dist/jquery.min.js');
        }

        return $this;
    }

    public function slim(): static
    {
        if ($this->available()) {
            $this->js('vendor/jquery/dist/jquery.slim.min.js');
        }

        return $this;
    }
}

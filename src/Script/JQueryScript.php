<?php

/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

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

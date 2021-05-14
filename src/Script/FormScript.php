<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Asset\AbstractScript;

/**
 * The FormScript class.
 */
class FormScript extends AbstractScript
{
    /**
     * FormScript constructor.
     */
    public function __construct(protected UnicornScript $unicornScript)
    {
    }

    public function flatpickr(): void
    {
        if ($this->available()) {
            $this->unicornScript->importThen(
                '@main',
                "u.\$ui.flatpickr()"
            );
        }
    }

    public function switcher(): void
    {
        if ($this->available()) {
            $this->css('@unicorn/switcher.css');
        }
    }
}

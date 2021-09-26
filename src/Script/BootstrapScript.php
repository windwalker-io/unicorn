<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Asset\AbstractScript;

/**
 * The BootstrapScript class.
 */
class BootstrapScript extends AbstractScript
{
    /**
     * FormScript constructor.
     */
    public function __construct(protected UnicornScript $unicornScript)
    {
    }

    public function iframeModal(): void
    {
        if ($this->available()) {
            $this->unicornScript->importMainThen(
                "u.\$ui.iframeModal()"
            );
        }
    }
}

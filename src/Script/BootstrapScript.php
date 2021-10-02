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

    public function popover(string $selector = '[data-bs-toggle=popover]', array $options = []): static
    {
        if ($this->available($selector)) {
            $optString = self::getJSObject($options);

            $this->unicornScript->importMainThen("u.\$ui.bootstrap.popover('$selector', $optString)");
        }

        return $this;
    }

    public function tooltip(string $selector = '[data-bs-toggle=tooltip]', array $options = []): static
    {
        if ($this->available($selector)) {
            $optString = self::getJSObject($options);

            $this->unicornScript->importMainThen("u.\$ui.bootstrap.tooltip('$selector', $optString)");
        }

        return $this;
    }

    public function iframeModal(): static
    {
        if ($this->available()) {
            $this->unicornScript->importMainThen(
                "u.\$ui.iframeModal()"
            );
        }

        return $this;
    }
}

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

    public function collapse(string $selector = '[data-bs-toggle=collapse]', array $options = []): static
    {
        if ($this->available($selector)) {
            $optString = self::getJSObject($options);

            $this->unicornScript->importMainThen("u.\$ui.bootstrap.collapse('$selector', $optString)");
        }

        return $this;
    }

    public function offcanvas(string $selector = '[data-bs-toggle=offcanvas]', array $options = []): static
    {
        if ($this->available($selector)) {
            $optString = self::getJSObject($options);

            $this->unicornScript->importMainThen("u.\$ui.bootstrap.offcanvas('$selector', $optString)");
        }

        return $this;
    }

    public function scrollspy(string $selector = '[data-bs-spy="scroll"]', array $options = []): static
    {
        if ($this->available($selector)) {
            $optString = self::getJSObject($options);

            $this->unicornScript->importMainThen("u.\$ui.bootstrap.scrollspy('$selector', $optString)");
        }

        return $this;
    }

    public function tab(string $selector = '[data-bs-toggle=tab]', array $options = []): static
    {
        if ($this->available($selector)) {
            $optString = self::getJSObject($options);

            $this->unicornScript->importMainThen("u.\$ui.bootstrap.tab('$selector', $optString)");
        }

        return $this;
    }

    public function toast(string $selector = '[data-bs-toggle=toast]', array $options = []): static
    {
        if ($this->available($selector)) {
            $optString = self::getJSObject($options);

            $this->unicornScript->importMainThen("u.\$ui.bootstrap.toast('$selector', $optString)");
        }

        return $this;
    }

    public function keepTab(?string $selector = null, array $options = []): static
    {
        if ($this->available($selector)) {
            $optString = self::getJSObject($options);
            $selector = json_encode($selector);

            $this->unicornScript->importMainThen("u.\$ui.bootstrap.keepTab($selector, $optString)");
        }

        return $this;
    }

    public function buttonRadio(?string $selector = null, array $options = []): static
    {
        if ($this->available($selector)) {
            $optString = self::getJSObject($options);
            $selector = json_encode($selector);

            $this->unicornScript->importMainThen("u.\$ui.bootstrap.buttonRadio($selector, $optString)");
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

    public function multiLevelMenu(): static
    {
        if ($this->available()) {
            $this->css('@unicorn/bootstrap/multi-level-menu.min.css');
        }

        return $this;
    }

    public function bs4Adapter(): static
    {
        if ($this->available()) {
            $this->css('@unicorn/bootstrap/bs4-adapter.min.css');
        }

        return $this;
    }
}

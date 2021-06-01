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

    public function singleImageDrag(): void
    {
        if ($this->available()) {
            $this->unicornScript->translate('unicorn.field.sid.*');

            $this->unicornScript->importThen(
                '@main',
                "u.\$ui.sid()"
            );
        }
    }

    public function fileDrag(): void
    {
        if ($this->available()) {
            $this->unicornScript->translate('unicorn.field.file.drag.*');

            $this->unicornScript->importThen(
                '@main',
                "u.\$ui.fileDrag()"
            );
        }
    }

    public function modalField(
        string $type,
        string $selector,
        string $modalSelector,
        string $callbackName
    ): void {
        if ($this->available($callbackName)) {
            $this->unicornScript->importThen(
                '@main',
                <<<JS
                u.\$ui.modalField().then(function () {
                    window.$callbackName = u.\$modalField.createCallback('$type', '$selector', '$modalSelector');
                });
                JS
            );
        }
    }
}

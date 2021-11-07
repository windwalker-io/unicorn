<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Script;

use Psr\Http\Message\UriInterface;
use Windwalker\Core\Asset\AbstractScript;
use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\AbstractField;

/**
 * The FormScript class.
 */
class FormScript extends AbstractScript
{
    /**
     * FormScript constructor.
     */
    public function __construct(protected UnicornScript $unicornScript, protected VueScript $vueScript)
    {
    }

    public function choices(?string $selector = null, array $options = []): static
    {
        if ($selector && $this->available($selector)) {
            $opt = static::getJSObject($options);
            $this->unicornScript->importMainThen("u.\$ui.choices('$selector', $opt)");
        } elseif ($this->available()) {
            $this->unicornScript->importMainThen("u.\$ui.choices()");
        }

        return $this;
    }

    public function cascadeSelect(): static
    {
        if ($this->available()) {
            $this->unicornScript->importMainThen("u.\$ui.cascadeSelect()");
        }

        return $this;
    }

    public function flatpickr(): static
    {
        if ($this->available()) {
            $this->unicornScript->importMainThen("u.\$ui.flatpickr()");
        }

        return $this;
    }

    public function switcher(): static
    {
        if ($this->available()) {
            $this->css('@unicorn/switcher.css');
        }

        return $this;
    }

    public function singleImageDrag(): static
    {
        if ($this->available()) {
            $this->unicornScript->translate('unicorn.field.sid.*');

            $this->unicornScript->importMainThen("u.\$ui.sid()");
        }

        return $this;
    }

    public function iframeModal(): static
    {
        if ($this->available()) {
            $this->unicornScript->importMainThen("u.\$ui.iframeModal()");
        }

        return $this;
    }

    public function fileDrag(): static
    {
        if ($this->available()) {
            $this->unicornScript->translate('unicorn.field.file.drag.*');

            $this->unicornScript->importMainThen(
                "u.\$ui.fileDrag()"
            );
        }

        return $this;
    }

    public function multiUploader(): static
    {
        if ($this->available()) {
            // $this->vueScript->vue();
            $this->unicornScript->translate('unicorn.field.multi.uploader.*');
            $this->unicornScript->translate('unicorn.field.file.drag.*');
            $this->unicornScript->importMainThen(
                "u.\$ui.multiUploader()"
            );
        }

        return $this;
    }

    public function colorPicker(): static
    {
        if ($this->available()) {
            $this->unicornScript->importMainThen("u.\$ui.colorPicker()");
        }

        return $this;
    }

    public function modalField(
        string $type,
        string $selector,
        string $modalSelector,
        string $callbackName
    ): static {
        if ($this->available($callbackName)) {
            $this->unicornScript->importMainThen(
                <<<JS
                u.\$ui.modalField().then(function () {
                    window.$callbackName = u.\$modalField.createCallback('$type', '$selector', '$modalSelector');
                });
                JS
            );
        }

        return $this;
    }

    public function listDependent(
        string $selector,
        string $dependent,
        mixed $source,
        array $options = []
    ): static {
        if ($this->available($selector, $dependent)) {
            if (is_string($source) || $source instanceof UriInterface) {
                $options['ajax']['url'] = (string) $source;
            } else {
                $options['source'] = $source;
            }

            $optionsString = self::getJSObject($options);

            $this->unicornScript->importMainThen(
                <<<JS
                u.\$ui.listDependent('$selector', '$dependent', $optionsString);
                JS
            );
        }

        return $this;
    }

    public function showOn(AbstractField $field): void
    {
        $showOn = $field->get('showon');

        if ($showOn && is_array($showOn)) {
            if ($this->available()) {
                $this->unicornScript->importMainThen('u.$ui.initShowOn();');
            }

            $conditions = [];

            foreach ($showOn as $path => $value) {
                $form = $field->getForm();
                $target = $form->getField($path);

                if (!$target) {
                    throw new \UnexpectedValueException("Field: {$path} not found.");
                }

                $conditions['#' . $target->getId()] = $value;
            }

            if ($conditions !== []) {
                $field->wrapperAttr('uni-show-on', json_encode($conditions));
            }
        }
    }
}

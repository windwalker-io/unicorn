<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\CheckboxField;
use Windwalker\Utilities\Arr;

/**
 * The SwitchField class.
 *
 * @method $this size(?string $value = null)
 * @method string getSize(string $value = null)
 * @method $this shape(?string $value = null)
 * @method string getShape(string $value = null)
 * @method $this color(string $value = null)
 * @method string getColor(string $value = null)
 * @method $this checkedValue(string $value = null)
 * @method string getCheckedValue(string $value = null)
 * @method $this uncheckedValue(string $value = null)
 * @method string getUncheckedValue(string $value = null)
 */
class SwitcherField extends CheckboxField
{
    use LayoutFieldTrait;

    public function getDefaultLayout(): string
    {
        return '@theme.field.switcher';
    }

    /**
     * @inheritDoc
     */
    public function prepareInput(DOMElement $input): DOMElement
    {
        if ($this->getCheckedValue() !== null) {
            $input->setAttribute(
                'checked',
                (string) $this->getValue() === (string) $this->getCheckedValue()
                    ? 'checked'
                    : null
            );
        }

        $input->setAttribute('value', $this->getCheckedValue() ?? '1');

        return parent::prepareInput($input);
    }

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        return $this->renderLayout(
            $this->getLayout(),
            [
                'input' => parent::buildFieldElement($input, $options),
                'field' => $this
            ]
        );
    }

    public function round(bool $value = true): static
    {
        if ($value) {
            $this->shape('round');
        } else {
            $this->shape('square');
        }

        return $this;
    }

    public function circle(bool $value = true): static
    {
        if ($value) {
            $this->shape('circle');
        } else {
            $this->shape('square');
        }

        return $this;
    }

    /**
     * getAccessors
     *
     * @return  array
     *
     * @since   3.1.2
     */
    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'shape',
                'color',
                'size',
                'checkedValue',
                'uncheckedValue',
            ]
        );
    }
}

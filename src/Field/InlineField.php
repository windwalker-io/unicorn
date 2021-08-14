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
use Windwalker\Form\Field\AbstractField;
use Windwalker\Form\Field\CompositeFieldInterface;
use Windwalker\Form\Form;
use Windwalker\Form\ValidateResult;
use Windwalker\Utilities\Arr;

/**
 * The InlineField class.
 *
 * @method $this showLabel(bool $value)
 * @method bool getShowLabel()
 */
class InlineField extends AbstractField implements CompositeFieldInterface
{
    use LayoutFieldTrait;
    use SubformFieldTrait;

    protected array $widths = [];

    protected ?string $group = null;

    public function getDefaultLayout(): string
    {
        return '@theme::field.inline';
    }

    public function prepareInput(DOMElement $input): DOMElement
    {
        return $input;
    }

    public function prepareForm(): Form
    {
        $form = $this->getSubForm();

        if ($this->group) {
            $form->appendNamespace($this->group);
        }

        return $form;
    }

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        return $this->renderLayout(
            $this->getLayout(),
            [
                'field' => $this,
                'input' => $input,
                'options' => $options,
                'form' => $this->prepareForm()
            ]
        );
    }

    public function widths(...$widths): static
    {
        $this->widths = $widths;

        return $this;
    }

    public function validate(mixed $value): ValidateResult
    {
        $results = $this->prepareForm()->validate((array) $value);

        if (!$failResult = $results->getFirstFailure()) {
            return new ValidateResult(ValidateResult::STATUS_SUCCESS, $this);
        }

        return $failResult;
    }

    public function filter(mixed $value): mixed
    {
        return $this->prepareForm()->filter($value);
    }

    /**
     * @return array
     */
    public function getWidths(): array
    {
        return $this->widths;
    }

    public function asGroup(string|bool|null $group): static
    {
        if ($group === true) {
            $group = $this->getName();
        } elseif ($group === false) {
            $group = null;
        }

        $this->group = $group;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getGroup(): ?string
    {
        return $this->group;
    }

    /**
     * getAccessors
     *
     * @return  array
     */
    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'showLabel',
            ]
        );
    }
}

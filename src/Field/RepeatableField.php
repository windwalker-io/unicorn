<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Form\Field\CompositeFieldInterface;
use Windwalker\Form\Form;
use Windwalker\Utilities\Arr;

/**
 * The RepeatableField class.
 */
class RepeatableField extends AbstractField implements CompositeFieldInterface
{
    use SubformFieldTrait;
    use LayoutFieldTrait;

    public const LAYOUT_TABLE = '@theme::field.repeatable.repeatable-table';
    public const LAYOUT_FLEX = '@theme::field.repeatable.repeatable-flex';

    protected bool $sortable = false;

    protected bool $ensureFirstRow = false;

    protected bool $singleArray = false;

    protected string $placeholder = '';

    protected int $max = 0;

    public function getDefaultLayout(): string
    {
        return static::LAYOUT_TABLE;
    }

    /**
     * @inheritDoc
     */
    public function prepareInput(DOMElement $input): DOMElement
    {
        $input['type'] = 'hidden';
        $input['name'] = $this->getInputName();
        $input['id'] = $this->getId();
        $input['data-repeatable-store'] = true;

        return $input;
    }

    public function prepareForm(): Form
    {
        $form = $this->getSubForm();

        $singleArray = $this->isSingleArray();

        if ($singleArray) {
            if ($form->count() > 2) {
                throw new \UnexpectedValueException(
                    'Repeatable field in singleArray mode should only contain key/value fields.'
                );
            }

            if (!$form->hasField('value')) {
                throw new \UnexpectedValueException(
                    'Repeatable field in singleArray mode must have a `value` field.'
                );
            }
        }

        foreach ($form->getFields() as $field) {
            $field->set('id', null);
            $field->set('name', null);
            $field->attr(':id', sprintf("getId(i, item, '%s')", $field->getName()));
            $field->attr(':name', sprintf("getName(i, item, '%s')", $field->getName()));

            $field->attr(':disabled', 'attrs.disabled != null');
            $field->attr(':readonly', 'attrs.readonly != null');
            $field->disabled($this->isDisabled());
            $field->readonly($this->isReadonly());

            $field->setValue(null);
            $field->attr('x-model', 'item.' . str_replace('/', '.', $field->getNamespaceName()));
        }

        return $form;
    }

    public function prepareJSData(): array
    {
        $subForm = $this->getSubForm();
        $value = $this->getValue() ?: [];

        $prepared = (array) $value;

        if (is_string($value)) {
            if (is_json($value)) {
                $prepared = json_decode($value, true);
            } else {
                $prepared = Arr::explodeAndClear(',', $value);
            }
        }

        if ($this->isSingleArray()) {
            $hasKey = $subForm->hasField('key');

            foreach ($prepared as $k => $v) {
                $item = ['value' => $v];

                if ($hasKey) {
                    $item['key'] = $k;
                }

                $prepared[$k] = $item;
            }
        }

        $prepared = array_values($prepared);

        $defaultValues = [];

        foreach ($subForm->getFields() as $field) {
            $defaultValues[$field->getName()] = $field->getDefaultValue();
        }

        $input = $this->getPreparedInput();

        return [
            'items' => $prepared,
            'defaultValues' => $defaultValues,
            'attrs' => $input->getAttributes(true)
        ];
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

    /**
     * @return bool
     */
    public function isSortable(): bool
    {
        return $this->sortable;
    }

    /**
     * @param  bool  $sortable
     *
     * @return  static  Return self to support chaining.
     */
    public function sortable(bool $sortable): static
    {
        $this->sortable = $sortable;

        return $this;
    }

    /**
     * @return bool
     */
    public function isEnsureFirstRow(): bool
    {
        return $this->ensureFirstRow;
    }

    /**
     * @param  bool  $ensureFirstRow
     *
     * @return  static  Return self to support chaining.
     */
    public function ensureFirstRow(bool $ensureFirstRow): static
    {
        $this->ensureFirstRow = $ensureFirstRow;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSingleArray(): bool
    {
        return $this->singleArray;
    }

    /**
     * @param  bool  $singleArray
     *
     * @return  static  Return self to support chaining.
     */
    public function singleArray(bool $singleArray): static
    {
        $this->singleArray = $singleArray;

        return $this;
    }

    /**
     * @return string
     */
    public function getPlaceholder(): string
    {
        return $this->placeholder;
    }

    /**
     * @param  string  $placeholder
     *
     * @return  static  Return self to support chaining.
     */
    public function placeholder(string $placeholder): static
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    /**
     * @return int
     */
    public function getMax(): int
    {
        return $this->max;
    }

    /**
     * @param  int  $max
     *
     * @return  static  Return self to support chaining.
     */
    public function max(int $max): static
    {
        $this->max = $max;

        return $this;
    }
}

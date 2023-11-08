<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Form\Field\CompositeFieldInterface;
use Windwalker\Form\Form;
use Windwalker\Form\ValidateResult;
use Windwalker\Utilities\Arr;
use Windwalker\Utilities\Reflection\ReflectAccessor;

use function Windwalker\uid;

/**
 * The InlineField class.
 *
 * @method $this showLabel(bool $value)
 * @method bool getShowLabel()
 */
class InlineField extends AbstractField implements CompositeFieldInterface
{
    use LayoutFieldTrait;
    use SubformFieldTrait {
        SubformFieldTrait::configureForm as parentConfigureForm;
    }

    protected array $widths = [];

    protected ?string $group = null;

    protected ?string $subFieldset = null;

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

            $value = $this->getValue();

            if (is_json($value)) {
                $value = (array) json_decode($value, true);
            }

            $form->fill((array) $value);
        }

        return $form;
    }

    public function configureForm(callable $handler): static
    {
        $r = $this->parentConfigureForm($handler);

        if (!$this->group) {
            $this->subFieldset ??= 'inline-' . uid();
            $fields = $this->subform->getFields();
            $form = $this->getForm();

            foreach ($fields as $name => $field) {
                $form->addField($field, $this->subFieldset);
            }

            ReflectAccessor::setValue($form, 'fieldset', $form->getFieldset($this->getFieldset()));
        }

        return $r;
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

    public function filter(mixed $value, int $formFilterOptions = 0): mixed
    {
        return $this->prepareForm()->filter($value, $formFilterOptions);
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

    protected function castToValidValue(mixed $value): mixed
    {
        return parent::castToValidValue($value);
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

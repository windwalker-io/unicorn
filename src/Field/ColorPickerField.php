<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\AbstractHtml5Field;

/**
 * The ColorField class.
 */
class ColorPickerField extends AbstractHtml5Field
{
    use LayoutFieldTrait;

    protected array $pickerOptions = [];

    public function getDefaultLayout(): string
    {
        return '@theme::field.color-picker';
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

    /**
     * @return array
     */
    public function getPickerOptions(): array
    {
        return $this->pickerOptions;
    }

    /**
     * @param  array  $pickerOptions
     *
     * @return  static  Return self to support chaining.
     */
    public function pickerOptions(array $pickerOptions): static
    {
        $this->pickerOptions = $pickerOptions;

        return $this;
    }
}

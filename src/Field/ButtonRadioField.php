<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\DOM\HTMLElement;
use Windwalker\Form\Field\RadioField;

/**
 * The ButtonRadioField class.
 */
class ButtonRadioField extends RadioField
{
    use LayoutFieldTrait;

    public function getDefaultLayout(): string
    {
        return '@theme::field.button-radio';
    }

    public function buildFieldElement(HTMLElement $input, array $options = []): string|HTMLElement
    {
        return $this->renderLayout(
            $this->getLayout(),
            [
                'input' => parent::buildFieldElement($input, $options),
                'field' => $this,
                'options' => $options
            ]
        );
    }
}

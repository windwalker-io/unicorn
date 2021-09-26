<?php

/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\DOM\DOMElement;
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

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
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

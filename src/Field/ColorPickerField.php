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
use Windwalker\Form\Field\AbstractHtml5Field;

/**
 * The ColorField class.
 */
class ColorPickerField extends AbstractHtml5Field
{
    use LayoutFieldTrait;

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
}

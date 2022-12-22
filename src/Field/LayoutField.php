<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\DOM\DOMElement;
use Windwalker\DOM\DOMFactory;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Utilities\Arr;

/**
 * The LayoutField class.
 */
class LayoutField extends AbstractField
{
    use LayoutFieldTrait;

    public function getDefaultLayout(): string
    {
        throw new \LogicException('Please provide a layout path');
    }

    /**
     * @inheritDoc
     */
    public function prepareInput(DOMElement $input): DOMElement
    {
        return DOMFactory::element('div', '');
    }

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        return $this->renderLayout(
            $this->getLayout(),
            [
                'input' => parent::buildFieldElement($input, $options),
                'field' => $this,
                'options' => $options,
            ]
        );
    }
}

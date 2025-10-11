<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\DOM\HTML5Factory;
use Windwalker\DOM\HTMLElement;
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
    public function prepareInput(HTMLElement $input): HTMLElement
    {
        return HTML5Factory::element('div');
    }

    public function compileFieldElement(HTMLElement $input, array $options = []): string|HTMLElement
    {
        return $this->renderLayout(
            $this->getLayout(),
            [
                'input' => parent::compileFieldElement($input, $options),
                'field' => $this,
                'options' => $options,
            ]
        );
    }
}

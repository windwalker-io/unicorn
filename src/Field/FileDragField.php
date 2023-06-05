<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Data\Collection;
use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\FileField;
use Windwalker\Utilities\Str;

/**
 * The DragFileField class.
 *
 * @method $this maxFiles(int $value)
 * @method mixed getMaxFiles()
 * @method $this maxSize(int $value)
 * @method mixed getMaxSize()
 * @method $this height(int $value)
 * @method mixed getHeight()
 */
class FileDragField extends FileField
{
    use LayoutFieldTrait;

    public function getDefaultLayout(): string
    {
        return '@theme::field.file-drag';
    }

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        // Fix accept
        if (trim((string) $this->getAccept())) {
            $this->accept(
                (string) Collection::explode(',', $this->getAccept())
                    ->map('trim')
                    ->map(function ($type) {
                        if (!str_contains($type, '/')) {
                            return Str::ensureLeft($type, '.');
                        }

                        return $type;
                    })
                    ->implode(',')
            );
        }

        $options = array_merge(
            $options,
            $this->getStates()
        );

        if ($this->isMultiple()) {
            $input['name'] = $this->getInputName('[]');
        }

        return $this->renderLayout(
            $this->getLayout(),
            [
                'field' => $this,
                'input' => $input,
                'options' => $options,
            ]
        );
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
                'maxFiles',
                'maxSize',
                'height',
                'layout',
            ]
        );
    }
}

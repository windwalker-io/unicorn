<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Unicorn\Script\FormScript;
use Windwalker\Core\Form\FormFactory;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Form\FieldDefinitionInterface;
use Windwalker\Form\Form;
use Windwalker\Utilities\Arr;
use Windwalker\Utilities\Str;
use Windwalker\Utilities\TypeCast;

/**
 * The MultiUploaderField class.
 *
 * @method  $this  placeholder(string $value = null)
 * @method  mixed  getPlaceholder()
 * @method  $this  url(string $value = null)
 * @method  mixed  getUrl()
 * @method  $this  resize(bool $value = null)
 * @method  mixed  getResize()
 * @method  $this  crop(bool $value = null)
 * @method  mixed  getCrop()
 * @method  $this  width(int $value = null)
 * @method  mixed  getWidth()
 * @method  $this  height(int $value = null)
 * @method  mixed  getHeight()
 * @method  $this  quality(int $value = null)
 * @method  mixed  getQuality()
 * @method  $this  maxFiles(int $value = null)
 * @method  mixed  getMaxFiles()
 * @method  $this  thumbSize(int $value)
 * @method  mixed  getThumbSize()
 * @method  $this  accept(string|array $value)
 * @method  mixed  getAccept()
 * @method  $this  canReplace(bool $value)
 * @method  mixed  isCanReplace()
 */
class MultiUploaderField extends AbstractField
{
    use FileUploadFieldTrait;
    use LayoutFieldTrait;
    use SubformFieldTrait;

    #[Inject]
    protected FormFactory $formFactory;

    #[Inject]
    protected FormScript $formScript;

    public function getDefaultLayout(): string
    {
        return '@theme.field.multi-uploader';
    }

    /**
     * prepareRenderInput
     *
     * @param  DOMElement  $input
     *
     * @return  DOMElement
     */
    public function prepareInput(DOMElement $input): DOMElement
    {
        return $input;
    }

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        $subForm = $this->prepareSubForm();
        $subForm->appendNamespace('/' . $this->getNamespaceName(true));

        $url = $this->getUrl() ?? (string) $this->getBuiltInUploadUrl($this->getUploadProfile() ?? 'image')
            ->var('resize', 0)
            ->var('crop', (int) $this->getCrop())
            ->var('width', $this->getWidth())
            ->var('height', $this->getHeight())
            ->var('quality', $this->getQuality());

        $values = $this->getValue() ?: [];
        $current = [
            'url' => '',
            'thumb_url' => ''
        ];

        if (is_string($values)) {
            if (Str::startsWith($values, '[') || Str::startsWith($values, '{')) {
                $values = json_decode($values);
            } else {
                $values = array_filter(explode(',', $this->getValue()), 'strlen');
            }
        }

        foreach ($values as &$value) {
            if (is_object($value)) {
                $value = TypeCast::toArray($value);
            }

            if (!is_array($value)) {
                $value = [
                    'url' => $value,
                    'thumb_url' => ''
                ];
            }

            // Prepare default value placeholder
            foreach ($subForm->getFields() as $field) {
                if (!isset($value[$field->getName()])) {
                    $value[$field->getName()] = $field->get('multiple') ? [] : '';
                }
            }
        }

        // Prepare default value placeholder
        foreach ($subForm->getFields() as $field) {
            $current[$field->getName()] = $field->get('multiple') ? [] : '';
        }

        $data = [
            'value' => $values,
            'uploadUrl' => $url,
            'maxFiles' => $this->getMaxFiles(),
            'current' => $current,
            'currentIndex' => null,
            'thumbSize' => $this->getThumbSize(),
            'disabled' => (bool) $this->isDisabled(),
            'readonly' => (bool) $this->isReadonly(),
            'loading' => false,
            'canReplace' => $this->isCanReplace(),
            'fieldName' => $this->getName(),
            'fieldFullName' => $this->getInputName()
        ];

        return $this->renderLayout(
            $this->getLayout(),
            [
                'field' => $this,
                'input' => $input,
                'options' => $options,
                'data' => $data,
                'subForm' => $subForm,
            ]
        );
    }

    protected function prepareSubForm(): Form
    {
        $form = $this->getSubForm();

        foreach ($form->getFields() as $field) {
            $field->setValue(null);
            $field->attr('v-model', 'current.' . $field->getName());
            $field->disabled($this->isDisabled());
            $field->readonly($this->isReadonly());
        }

        return $form;
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
                'placeholder',
                'url',
                'resize',
                'crop',
                'height',
                'width',
                'quality',
                'maxFiles',
                'imageForm',
                'editForm',
                'thumbSize',
                'accept',
                'canReplace',
            ]
        );
    }
}

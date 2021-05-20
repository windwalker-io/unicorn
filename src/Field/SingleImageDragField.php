<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Lyrasoft\Luna\Helper\LunaHelper;
use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\TextareaField;

/**
 * The SingleImageDragField class.
 *
 * @method  $this  width(int $value)
 * @method  mixed  getWidth()
 * @method  $this  height(int $value)
 * @method  mixed  getHeight()
 * @method  $this  maxWidth(int $value)
 * @method  mixed  getMaxWidth()
 * @method  $this  minWidth(int $value)
 * @method  mixed  getMinWidth()
 * @method  $this  maxHeight(int $value)
 * @method  mixed  getMaxHeight()
 * @method  $this  minHeight(int $value = null)
 * @method  mixed  getMinHeight()
 * @method  $this  showSizeNotice(bool $value = null)
 * @method  mixed  isShowSizeNotice()
 * @method  $this  crop(bool $value = null)
 * @method  mixed  isCrop()
 * @method  $this  originSize(bool $value = null)
 * @method  mixed  getOriginSize()
 * @method  $this  defaultImage(string $value = null)
 * @method  mixed  getDefaultImage()
 * @method  $this  ajax(bool|string $value = null)
 * @method  mixed  getAjax()
 * @method  $this  previewHandler(callable $value = null)
 * @method  mixed  getPreviewHandler()
 */
class SingleImageDragField extends TextareaField
{
    use FileUploadFieldTrait;
    use LayoutFieldTrait;

    public function getDefaultLayout(): string
    {
        return '@theme.field.single-image-drag.sid-default';
    }

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        if ($ajax = $this->getAjax()) {
            if (is_bool($ajax)) {
                $options['ajax_url'] = $this->getBuiltInUploadUrl('image')->var('resize', 0);
            } else {
                $options['ajax_url'] = (string) $this->ajax();
            }
        }

        return $this->renderLayout(
            $this->getLayout(),
            [
                'field' => $this,
                'input' => $input,
                'options' => $options
            ]
        );
    }

    /**
     * getAccessors
     *
     * @return  array
     *
     * @since   3.1.2
     */
    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'crop',
                'defaultImage',
                'exportZoom',
                'height',
                'maxHeight',
                'maxWidth',
                'minHeight',
                'minWidth',
                'showSizeNotice',
                'previewHandler',
                'originSize',
                'version',
                'width',
                'layout',
                'ajax',
            ]
        );
    }
}

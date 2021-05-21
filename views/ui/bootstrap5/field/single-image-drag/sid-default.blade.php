<?php

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var $vm        object          The view model object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

declare(strict_types=1);

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var \Unicorn\Field\SingleImageDragField $field
 * @var array $options
 * @var \Unicorn\Image\ImageHelper $imageHelper
 */

$inputElement = $field->getPreparedInput();
$inputElement->addClass('c-sid-default');
$imageHelper = $app->service(\Unicorn\Image\ImageHelper::class);

$image = $field->getValue() ?: $imageHelper->placeholder();
$previewHandler = $field->getPreviewHandler() ?? fn () => $asset->appendVersion($image, \Windwalker\uid());

$maxWidth = $field->getMaxWidth();
$minWidth = $field->getMinWidth();
$maxHeight = $field->getMaxHeight();
$minHeight = $field->getMinHeight();
?>
<div {!! $inputElement::buildAttributes($inputElement) !!}>
    <div class="d-flex">
        <div class="c-sid-default__left-col d-flex align-items-start">
            <img class="c-sid-default__preview img-responsive img-fluid"
                {{-- TextField has escaped value, so we don't need to escape again --}}
                src="{{ $image }}"
                alt="Preview">
            <img src="{{ $imageHelper->ajaxLoader() }}"
                id="{{ $field->getId('__ajax-loader') }}" class="c-sid-default__img-loader mx-auto align-self-center"
                alt="Lading"
                style="display: none;">
        </div>
        @if (!$field->isReadonly() && !$field->isDisabled())
            <div class="c-sid-default__right-col flex-grow-1">
                <div class="c-sid-default__dragarea">
                    <div class="c-sid-default__upload-actions">
                        <button class="btn btn-success btn-sm btn-xs sid-file-select-button" type="button">
                            <span class="fa fa-picture-o"></span>
                            @lang('unicorn.field.sid.button.select')
                        </button>
                        <button type="button"
                            class="btn btn-outline-success btn-sm btn-xs sid-paste-button"
                        >
                            <span class="fa fa-paste"></span>
                        </button>
                    </div>
                    <div class="c-sid-default__upload-desc">
                        @lang('unicorn.field.sid.drop.desc')
                    </div>
                    @if ($field->get('show_size_notice', false))
                        @if ($options['crop'])
                            <div class="c-sid-default__size-info">
                                @lang('unicorn.field.sid.crop.size.desc', $options['width'], $options['height'])
                            </div>
                        @elseif ($maxHeight || $maxWidth || $minWidth || $minHeight)
                            <div class="c-sid-default__size-info">
                                @if ($minWidth || $maxHeight)
                                    <div class="max-size">
                                        @if ($maxWidth !== null && $maxHeight !== null)
                                            @lang('unicorn.field.sid.max.width.height', $maxWidth, $maxHeight)
                                        @elseif ($maxWidth !== null)
                                            @lang('unicorn.field.sid.max.width', $maxWidth)
                                        @elseif ($maxHeight !== null)
                                            @lang('unicorn.field.sid.max.height', $maxHeight)
                                        @endif
                                    </div>
                                @endif

                                @if ($minWidth || $minHeight)
                                    <div class="min-size">
                                        @if ($minWidth !== null && $minHeight !== null)
                                            @lang('unicorn.field.sid.min.width.height', $minWidth, $minHeight)
                                        @elseif ($minWidth !== null)
                                            @lang('unicorn.field.sid.min.width', $minWidth)
                                        @elseif ($minHeight !== null)
                                            @lang('unicorn.field.sid.min.height', $minHeight)
                                        @endif
                                    </div>
                                @endif
                            </div>
                        @endif
                    @endif
                    <img src="{{ $imageHelper->ajaxLoader() }}"
                        id="{{ $field->getId('__loader') }}" class="c-sid-default__loader" alt="Lading" style="display: none;">
                </div>

                @if (!$field->isRequired())
                    <div class="checkbox checkbox-primary mt-2" style="">
                        <input type="checkbox" id="{{ $field->getId('__remove') }}"
                            class="c-sid-default__remove"/>
                        <label for="{{ $field->getId('__remove') }}">
                            @lang('unicorn.field.sid.delete')
                        </label>
                    </div>
                @endif
            </div>
        @endif
    </div>
</div>

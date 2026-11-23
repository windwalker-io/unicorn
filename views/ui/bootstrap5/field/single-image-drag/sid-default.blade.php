<?php

declare(strict_types=1);

namespace App\View;

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

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var  \Unicorn\Field\SingleImageDragField  $field
 * @var  array                                $options
 * @var  \Unicorn\Image\ImagePlaceholder      $imageHelper
 */

$inputElement = $field->getPreparedInput();
$inputElement->addClass('c-sid-default');
$imageHelper = $app->service(\Unicorn\Image\ImagePlaceholder::class);

$image = $field->getValue() ?: $field->getDefaultImage() ?: $imageHelper->placeholder4to3();
$previewHandler = $field->getPreviewHandler() ?? fn() => $asset->appendVersion($image, \Windwalker\uid());
$image = $previewHandler($image);

$maxWidth = $field->getMaxWidth();
$minWidth = $field->getMinWidth();
$maxHeight = $field->getMaxHeight();
$minHeight = $field->getMinHeight();

$options['modalTarget'] = '#' . $field->getId('__modal');

?>
<uni-sid style="visibility: hidden" options="{{ json_encode($options) }}">
    <div id="{{ $field->getId('-container') }}">
        <div class="d-flex">
            <div class="c-sid-default__left-col d-flex align-items-start">
                <img class="c-sid-default__preview img-fluid"
                    {{-- TextField has escaped value, so we don't need to escape again --}}
                    data-sid="preview"
                    src="{{ $image }}"
                    style="max-height: 180px"
                    alt="Preview">
                <div class="c-sid-default__img-loader"
                    data-sid="file-uploading"
                    style="display: none;">
                    <span class="spinner-border spinner-border-sm"></span>
                </div>
            </div>
            @if (!$field->isReadonly() && !$field->isDisabled())
                <div class="c-sid-default__right-col flex-grow-1">
                    <div class="c-sid-default__dragarea" data-sid="dragarea">
                        <div class="c-sid-default__upload-actions">
                            <button class="btn btn-success btn-sm btn-xs sid-file-select-button" type="button"
                                data-sid="select">
                                <span class="fa fa-image"></span>
                                @lang('unicorn.field.sid.button.select')
                            </button>
                            <button type="button"
                                data-sid="paste"
                                class="btn btn-outline-success btn-sm btn-xs sid-paste-button"
                            >
                                <span class="fa fa-paste"></span>
                            </button>
                        </div>
                        <div class="c-sid-default__upload-desc">
                            @lang('unicorn.field.sid.drop.desc')
                        </div>
                        @if ($field->isShowSizeNotice())
                            @if ($options['crop'] ?? false)
                                <div class="c-sid-default__size-info">
                                    @lang('unicorn.field.sid.crop.size.desc', $options['width'], $options['height'])
                                </div>
                            @elseif ($maxHeight || $maxWidth || $minWidth || $minHeight)
                                <div class="c-sid-default__size-info">
                                    @if ($minWidth || $maxHeight)
                                        <div class="c-sid-default__max-size">
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
                                        <div class="c-sid-default__min-size">
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
                        <div id="{{ $field->getId('__loader') }}"
                            class="spinner-border c-sid-default__loader"
                            style="display: none;">

                        </div>
                    </div>

                    <div class="d-none">
                        {!! $input !!}

                        @php($input->setAttribute('type', 'file'))
                        <input type="file" name="{{ $input->getAttribute('name') }}" data-sid="file" />
                    </div>

                    @if (!$field->isRequired())
                        <div class="mt-2" style="">
                            <input type="checkbox" id="{{ $field->getId('__remove') }}"
                                data-sid="remove"
                                class="c-sid-default__remove form-check-input"/>
                            <label for="{{ $field->getId('__remove') }}">
                                @lang('unicorn.field.sid.delete')
                            </label>
                        </div>
                    @endif
                </div>
            @endif
        </div>
    </div>
</uni-sid>

@include('@theme::field.single-image-drag.sid-modal')

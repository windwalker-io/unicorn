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

$options['modalTarget'] = '#' . $field->getId('__modal');

?>
<uni-sid style="visibility: hidden" options="{{ json_encode($options) }}">
    <div id="{{ $field->getId('-container') }}">
        <div class="d-flex">
            <div class="c-sid-default__left-col d-flex align-items-start">
                <img class="c-sid-default__preview img-responsive img-fluid"
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
                                <span class="fa fa-picture-o"></span>
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
                        <img src="{{ $imageHelper->ajaxLoader() }}"
                            id="{{ $field->getId('__loader') }}" class="c-sid-default__loader" alt="Lading" style="display: none;">
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

@teleport('uni.sid:' . $field->getId())
<div class="modal fade c-sid-modal" id="{{ $field->getId('__modal') }}" tabindex="-1" role="dialog"
    data-sid="modal"
    aria-labelledby="{{ $field->getId('__modal-label') }}" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="{{ $field->getId('__modal-label') }}">
                    @lang('unicorn.field.sid.crop.modal.title')
                </h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="c-sid-modal__loading">
                    <span class="spinner-grow"></span>
                </div>
                <div class="c-sid-modal__content">
                    <div class="c-sid-modal__img-container" data-sid="crop-container" style="height: 400px; visibility: hidden">
                        <img id="image" src="" alt="Picture" data-sid="cropper" style="height: 400px; visibility: hidden">
                    </div>

                    <div class="mt-3 d-flex justify-content-between align-items-center w-100">
                        <div>
                            <span class="fa fa-fw fa-search-plus"></span>
                            Scroll to zoom in/out
                        </div>
                        <div class="">
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="zoom-out">
                                <span class="fa fa-fw fa-search-minus"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="zoom-in">
                                <span class="fa fa-fw fa-search-plus"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="rotate-left">
                                <span class="fa fa-fw fa-undo"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="rotate-right">
                                <span class="fa fa-fw fa-redo"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="scale-x">
                                <span class="fa fa-fw fa-arrows-alt-h"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="scale-y">
                                <span class="fa fa-fw fa-arrows-alt-v"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-outline-secondary" data-bs-dismiss="modal">
                    @translate('unicorn.field.sid.crop.modal.close')
                </button>
                <button type="button" class="btn btn-primary"
                    data-sid="save-button">
                    @translate('unicorn.field.sid.crop.modal.ok')
                </button>
            </div>
        </div>
    </div>
</div>
@endTeleport

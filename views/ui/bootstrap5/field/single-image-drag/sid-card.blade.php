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

$imageHelper = $app->service(\Unicorn\Image\ImagePlaceholder::class);

$image = $field->getValue() ?: $imageHelper->placeholder();
$previewHandler = $field->getPreviewHandler() ?? fn() => $asset->appendVersion($image, \Windwalker\uid());
$image = $previewHandler($image);

$options ??= [];
$options['modalTarget'] = '#' . $field->getId('__modal');

$minHeight = $field->getMinHeight() ?? 200;

?>

<uni-sid style="visibility: hidden" options="{{ json_encode($options) }}">
    <div id="{{ $field->getId('-container') }}">
        <div class="card">
            <div class="card-body c-sid__preview" data-sid="dragarea"
                style="min-height: {{ $minHeight }}px">
                <img src="{{ $image }}" alt="sid-preview" class="c-sid__image" data-sid="preview"
                    style="max-height: {{ $minHeight }}px; max-width: 100%;">
                <div class="c-sid-default__img-loader"
                    data-sid="file-uploading"
                    style="display: none;">
                    <span class="spinner-border spinner-border-sm"></span>
                </div>
            </div>

            @if (!$field->isReadonly() && !$field->isDisabled())
                <div class="card-footer d-flex p-0">
                    <button type="button"
                        class="c-sid__button c-sid__button--select px-3 py-2 border-end text-nowrap btn btn-link"
                        data-sid="select">
                        <span class="fas fa-image"></span>
                        @lang('unicorn.field.sid.button.select')
                    </button>

                    <span class="me-auto text-muted px-3 py-2"
                        data-bs-toggle="tooltip"
                        title="
                    @if ($field->getMaxWidth() !== null && $field->getMaxHeight() !== null)
                    @lang('unicorn.field.sid.max.width.height', $field->getMaxWidth(), $field->getMaxHeight())
                    @elseif ($field->getMaxWidth() !== null)
                    @lang('unicorn.field.sid.max.width', $field->getMaxWidth())
                    @elseif ($field->getMaxHeight() !== null)
                    @lang('unicorn.field.sid.max.height', $field->getMaxHeight())
                    @endif
                        ">
                        or drag image here
                        <small class="fa fa-question-circle"></small>
                    </span>

                    @if (!$field->isRequired())
                        <label class="c-sid__button c-sid__button--delete px-3 py-2 border-start text-nowrap mb-0">
                            <input type="checkbox" data-sid="remove" class="d-none" />
                            <span class="fas fa-trash"></span>
                            @lang('unicorn.field.sid.delete')
                        </label>
                    @endif
                </div>
            @endif
        </div>

        <div class="d-none">
            {!! $input !!}

            <input type="file" name="{{ $input->getAttribute('name') }}" data-sid="file" />
        </div>
    </div>
</uni-sid>

@include('@theme::field.single-image-drag.sid-modal')

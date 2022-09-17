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
 * @var \Unicorn\Field\SingleImageDragField $field
 * @var array                               $options
 * @var \Unicorn\Image\ImagePlaceholder     $imageHelper
 */

$inputElement = $field->getPreparedInput();
$inputElement->addClass('c-sid');
$imageHelper = $app->service(\Unicorn\Image\ImagePlaceholder::class);

$image = $field->getValue() ?: $imageHelper->placeholder();
$previewHandler = $field->getPreviewHandler() ?? fn () => $asset->appendVersion($image, \Windwalker\uid());

?>

<div {!! $inputElement::buildAttributes($inputElement) !!}>
    <div class="card">
        <div class="card-body c-sid__preview"
            style="min-height: {{ $field->getMinHeight() ?? 200 }}px">
            <img src="{{ $image }}" alt="sid-preview" class="c-sid__image"
                style="max-height: {{ $field->getMinHeight() ?? 200 }}px; max-width: 100%;">
        </div>

        <div class="card-footer d-flex p-0">
            <a class="c-sid__button c-sid__button--select px-3 py-2 border-end text-nowrap" href="javascript://">
                <span class="fas fa-image"></span>
                Select
            </a>

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

            <a class="c-sid__button c-sid__button--delete px-3 py-2 border-start text-nowrap" href="javascript://">
                <span class="fas fa-trash"></span>
                Remove
            </a>
        </div>
    </div>
</div>

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
 * @var \Unicorn\Field\FileDragField $field
 */

$app->service(\Unicorn\Script\FormScript::class)->fileDrag();

$position = $field->getShoeUploadedPosition();

$layout = $field->getPreviewLayout();
$value = $field->getValue();
?>

<div class="c-file-drag card">
    @if ($position === 'top')
        <div class="c-file-drag__preview c-file-drag-preview card-header">
            @if ($layout)
                {!! $field->renderPreview() !!}
            @else
                <span class="c-file-drag-preview__label">@lang('unicorn.field.file.drag.preview.text')</span>
                <a class="c-file-drag-preview__link"
                    href="{{ $field->getCompiledDownloadLink($value) }}" target="_blank">
                    {{ $field->getUploadedFilename($value) }}
                </a>
            @endif
        </div>
    @endif

    <uni-file-drag class="custom-file c-file-drag-input" style="visibility: hidden;"
        options="{{ json_encode($options) }}">
        {!! $input !!}
        <label class="px-3 c-file-drag-input__label"
            data-overlay-label
            for="{{ $field->getId() }}">
            <span class="label-text d-block">
                <span class="fa fa-upload"></span>
            </span>
            <button type="button" class="c-file-drag-input__button btn btn-success btn-sm px-2 py-1">
                @lang('unicorn.field.file.drag.button.text')
            </button>
        </label>
    </uni-file-drag>

    @if ($position === 'bottom')
        <div class="c-file-drag__preview c-file-drag-preview card-footer">
            @if ($layout)
                {!! $field->renderPreview() !!}
            @else
                <span class="c-file-drag-preview__label">@lang('unicorn.field.file.drag.preview.text')</span>
                <a class="c-file-drag-preview__link"
                    href="{{ $field->getCompiledDownloadLink($value) }}" target="_blank">
                    {{ $field->getUploadedFilename($value) }}
                </a>
            @endif
        </div>
    @endif
</div>

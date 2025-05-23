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
use Windwalker\DOM\HTMLElement;

use function Windwalker\DOM\h;

/**
 * @var $field \Unicorn\Field\FileDragField
 * @var $input HTMLElement
 */

$app->service(\Unicorn\Script\FormScript::class)->fileDrag();

$position = $field->getShowUploadedPosition();

$layout = $field->getPreviewLayout();
$value = $field->getValue();

$placeholderInput = h('input');
$placeholderInput['id'] = $field->getId('__placeholder');
$placeholderInput['name'] = $input['name'];
$placeholderInput['type'] = 'text';
$placeholderInput['style'] = 'height: 0; opacity: 0; position: absolute; top: 0;';
$placeholderInput['value'] = $value;
$placeholderInput['readonly'] = $field->isReadonly();
$placeholderInput['disabled'] = $field->isDisabled();
$placeholderInput['data-role'] = 'placeholder';
?>

<div class="c-file-drag card" uni-file-drag-field>
    @if ($position === 'top' && $value)
        <div class="c-file-drag__preview c-file-drag-preview card-header  d-flex gap-2">
            @if ($layout)
                {!! $field->renderPreview() !!}
            @else
                @php($link = $field->getCompiledDownloadLink($value))
                <span class="c-file-drag-preview__label">@lang('unicorn.field.file.drag.preview.text')</span>
                <a class="c-file-drag-preview__link"
                    @attr('href', $link ?: null) target="_blank">
                    {{ $field->getUploadedFilename($value) }}
                </a>
                <a href="javascript:void(0)" class="ms-auto d-inline-block px-2 c-file-drag-preview__delete"
                    title="@lang('unicorn.field.file.drag.delete')"
                    data-bs-toggle="tooltip"
                >
                    <i class="fa fa-trash"></i>
                </a>
            @endif
        </div>
    @endif

    <uni-file-drag class="custom-file c-file-drag-input" style="visibility: hidden;"
        options="{{ json_encode($options) }}">
        {!! $input !!}
        {!! $placeholderInput !!}
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

    @if ($position === 'bottom' && $value)
        <div class="c-file-drag__preview c-file-drag-preview card-footer d-flex gap-2">
            @if ($layout)
                {!! $field->renderPreview() !!}
            @else
                @php($link = $field->getCompiledDownloadLink($value))
                <span class="c-file-drag-preview__label">@lang('unicorn.field.file.drag.preview.text')</span>
                <a class="c-file-drag-preview__link"
                    @attr('href', $link ?: null) target="_blank">
                    {{ $field->getUploadedFilename($value) }}
                </a>
                <a href="javascript:void(0)" class="ms-auto d-inline-block px-2 c-file-drag-preview__delete"
                    title="@lang('unicorn.field.file.drag.delete')"
                    data-bs-toggle="tooltip"
                >
                    <i class="fa fa-trash"></i>
                </a>
            @endif
        </div>
    @endif
</div>

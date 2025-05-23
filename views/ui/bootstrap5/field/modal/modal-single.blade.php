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
 * @var \Unicorn\Field\ModalField $field
 * @var \Windwalker\DOM\HTMLElement $input
 */

$modalId = $field->getId('-modal');

$callback = $field->getCallback();

$app->service(\Unicorn\Script\BootstrapScript::class)->iframeModal();
$app->service(\Unicorn\Script\FormScript::class)
    ->modalField('single', '#' . $field->getId() . '-wrap', '#' . $modalId, $callback);

$disabled = $field->isReadonly() || $field->isDisabled();

?>

<div id="{{ $field->getId('-wrap') }}" class="c-modal-field c-modal-field--single"
    uni-field-validate='{"selector": "[data-field-input]"}'>
    <div class="input-group">
        @if ($field->isHasImage())
            <div class="input-group-text c-modal-field__image">
                <div class="c-modal-field__preview"
                    data-role="image"
                    style="height: 1.5em; width: 1.5em; border-radius: 2px; background: url({{ $image }}) center center; background-size: cover">

                </div>
            </div>
        @endif

        <input type="text"
            disabled="disabled"
            readonly="readonly"
            id="{{ $field->getId('-title') }}"
            class="form-control {{ $field->getTitleClass() }}"
            value="{{ $title ?? '' }}"
            placeholder="{{ $field->getPlaceholder() }}"
            data-role="title"
        />

        @if (!$disabled)
            <a href="{{ $url }}" uni-modal-link="#{{ $modalId }}"
                data-size="modal-xl"
                data-height="{{ $field->getModalHeight() ?: '80vh' }}"
                class="btn btn-primary c-modal-field__select"
                style="pointer-events: none"
            >
                {!! $buttonText !!}
            </a>

            @if (!$field->isRequired())
                <a href="javascript://" role="button"
                    class="btn btn-primary c-modal-field__unselect"
                    onclick="{{ $callback }}({})">
                    <span class="fa fa-times fa-xmark"></span>
                </a>
            @endif
        @endif
    </div>

    {!! $input !!}
</div>

@teleport($modalId)
<uni-iframe-modal id="{{ $modalId }}"></uni-iframe-modal>
@endTeleport

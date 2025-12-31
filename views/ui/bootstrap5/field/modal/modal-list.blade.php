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

$listOptions = [
    'max' => $field->getMax(),
    'modalSelector' => '#' . $modalId,
    'itemTemplate' => "#$modalId-tmpl",
    'dataKey' => $field->getId(),
    'sortable' => $field->isSortable()
];

$app->service(\Unicorn\Script\BootstrapScript::class)->iframeModal();
$app->service(\Unicorn\Script\FormScript::class)
    ->modalField(
        'list',
        '#' . $field->getId() . '-wrap',
        '#' . $modalId,
        $callback
    );
$uniScript = $app->service(\Unicorn\Script\UnicornScript::class);
$uniScript->translate(
    [
        'unicorn.field.modal.already.selected',
        'unicorn.field.modal.max.selected'
    ]
);

$disabled = $field->isReadonly() || $field->isDisabled();

?>

<uni-modal-list id="{{ $field->getId('-wrap') }}"
    class="c-modal-field c-modal-field--list"
    options="{{ json_encode($listOptions) }}">
    <input id="{{ $field->getId('-empty') }}"
        type="hidden"
        data-role="empty"
        data-name="{{ $field->getInputName() }}"
        value="{{ $field->get('empty_array_value', '__EMPTY_ARRAY__') }}"
    />

    <div class="card">
        <div class="card-body p-2 d-flex">
            <div class="text-muted pl-2 align-self-center">
                {!! $field->getPlaceholder() !!}
            </div>

            <div class="c-modal-field__toolbar ms-auto">
                <div class="btn-group">
                    <a @attr('disabled', $disabled)
                        href="{{ $url }}"
                        data-role="select"
                        data-size="modal-xl"
                        data-height="{{ $field->getModalHeight() ?: '80vh' }}"
                        class="btn btn-primary c-modal-field__select {{ $disabled ? 'disabled' : '' }}"
                        style="pointer-events: none"
                    >
                        {!! $buttonText !!}
                    </a>
                    <button type="button" class="btn btn-primary"
                        data-bs-toggle="tooltip"
                        title="@lang('unicorn.field.modal.clear.all')"
                        data-role="clear"
                        @attr('disabled', $disabled)
                    >
                        <span class="fa fa-xmark"></span>
                    </button>
                </div>
            </div>
        </div>

        <div class="list-group list-group-flush"
            data-role="list-container"
            style="max-height: {{ $field->getHeight() }}px; overflow-y: auto">
            {{-- items --}}
        </div>
        @if ($field->isRequired())
            @php($input->removeAttribute('value'))
            <input type="text"
                name="{{ $field->getInputName() }}"
                value=""
                data-role="validation-placeholder"
                style="display: none;"
                @attr('disabled', $field->isDisabled())
                @attr('readonly', $field->isReadonly())
                {!! $input->attributesToString() !!} />
        @endif
    </div>
</uni-modal-list>

@teleport($modalId)
<uni-iframe-modal id="{{ $modalId }}"></uni-iframe-modal>

<script id="{{ $modalId }}-tmpl" type="text/template">
    <div class="list-group-item item">
        <div class="d-flex gap-2">
            @if ($field->isSortable())
                <div class="h-drag-handle" style="cursor: move;">
                    <span class="fa fa-fw fa-ellipsis-v"></span>
                </div>
            @endif

            @if ($field->isHasImage())
                <div class="modal-list-item-image">
                    <div style="height: 2em; width: 2em; border-radius: 2px; background: url(${item.image}) center center; background-size: cover">

                    </div>
                </div>
            @endif

            <div class="modal-list-item-title flex-grow-1">
                <a <% if (item.link) { %> href="${item.link ?? 'javascript://'}" target="_blank" <% } %>>
                    <span class="badge bg-secondary">
                    ${item.value}
                </span>
                ${item.title}
                </a>
            </div>
            <div class="modal-list-item-delete">
                <button type="button" class="btn btn-outline-secondary btn-sm"
                    data-role="remove"
                    @attr('disabled', $disabled)
                >
                    <span class="fa fa-trash"></span>
                </button>

                <input data-field-input data-role="value" type="hidden" name="{{ $field->getInputName('[]') }}"
                    value="${item.value}" />
            </div>
        </div>
    </div>
</script>
@endTeleport

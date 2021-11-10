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
 * @var \Unicorn\Field\RepeatableField $field
 * @var \Windwalker\Form\Form $form
 */

$app->service(\Unicorn\Script\FormScript::class)->repeatable();
// $app->service(\Unicorn\Script\UnicornScript::class)
//     ->data($uid, $field->prepareJSData());

$inputElement = $field->getPreparedInput();

$optString = AssetService::getJSObject(
    [
        'fieldName' => $field->getInputName(),
        'sortable' => $field->isSortable(),
        'hasKey' => (bool) $form->hasField('key'),
        'singleArray' => $field->isSingleArray(),
    ]
);

$data = AssetService::getJSObject($field->prepareJSData());
?>

<div id="{{ $field->getId('-wrap') }}" class="c-repeatable-field"
    x-data="RepeatableField({{ $data }}, {{ $optString }})">
    <table class="table">
        <thead>
        <tr>
            <template x-if="options.sortable">
                <th width="1%">#</th>
            </template>
            <th width="">
                {{ $field->getPlaceholder() }}
            </th>
            @if ($field->canModify())
                <th class="text-right" width="1%">
                    <button type="button" class="btn btn-sm btn-success btn-primary"
                        :disabled="!canAdd"
                        @click="addItem(-1)">
                        <span class="fa fa-plus"></span>
                    </button>
                </th>
            @endif
        </tr>
        </thead>
        <tbody x-model="items"
{{--            is="{{ $field->isSortable() ? 'draggable' : 'tbody' }}" --}}
{{--            element="tbody"--}}
{{--            :options="{ handle: '.drag-handle', animation: 300 }"--}}
        >
        <template x-for="(item, i) of items">
            <tr :key="item.uid" x-ref="`repeat-item-${i}`">
                <template x-if="options.sortable">
                    <td>
                        <div class="drag-handle" style="cursor: move;">
                            <span class="fa fa-ellipsis-v" ></span>
                        </div>
                    </td>
                </template>
                <td class="">
                    <div class="row">
                        @foreach ($form->getFields() as $subField)
                            <div class="{{ $subField->get('subfield_class') ?: 'col-lg-4' }}">
                                <x-field :field="$subField"></x-field>
                            </div>
                        @endforeach
                    </div>
                </td>
                @if ($field->canModify())
                    <td class="text-nowrap text-right" width="1%">
                        <button type="button" class="btn btn-sm btn-success btn-primary"
                            @click="addItem(i)"
                            :disabled="!canAdd"
                        >
                            <span class="fa fa-plus"></span>
                        </button>
                        <button type="button" class="btn btn-sm btn-success btn-danger"
                            @click="delItem(i)">
                            <span class="fa fa-trash"></span>
                        </button>
                    </td>
                @endif
            </tr>
        </template>
        </tbody>
    </table>

    <div class="d-none">
        {!! $inputElement !!}
    </div>
</div>

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
use Windwalker\Form\Field\AbstractField;
use Windwalker\Form\Field\HiddenField;

/**
 * @var \Unicorn\Field\RepeatableField $field
 * @var \Windwalker\Form\Form          $form
 */

$app->service(\Unicorn\Script\FormScript::class)->repeatable();

$inputElement = $field->compileInput();
$countFields = iterator_count($form->getFields());

$optString = AssetService::getJSObject(
    [
        'id' => $field->getId(),
        'fieldName' => $field->getInputName(),
        'sortable' => $field->isSortable(),
        'hasKey' => (bool) $form->hasField('key'),
        'singleArray' => $field->isSingleArray(),
        'ensureFirstRow' => $field->isEnsureFirstRow(),
        'max' => $field->getMax()
    ]
);

$data = AssetService::getJSObject($field->prepareJSData());

if ($field->colWidths !== []) {
    $columnsStyle = "grid-template-columns: repeat(12, 1fr);";
} else {
    $columnsStyle = "grid-template-columns: repeat(" . $countFields . ", 1fr);";
}

$colWidth = function (AbstractField $subField, $i) use ($field, $countFields) {
    $w = $field->colWidths[$i] ?? null;

    $style = '';

    if ($w === null) {
        if ($field->colWidths !== []) {
            $style = "grid-column: span " . ceil(12 / $countFields) . ";";
        }
    } elseif (is_numeric($w)) {
        $style = "grid-column: span $w;";
    } else {
        $style = "width: $w;";
    }

    return $style;
};

$gap = $field->gap;
$gapClass = '';
$gapStyle = '';

if ($gap) {
    if (is_numeric($gap)) {
        $gapClass = "gap-$gap";
    } else {
        $gapStyle = "gap: $gap;";
    }
}
?>

<div id="{{ $field->getId('-wrap') }}" class="c-repeatable-field"
    data-repeatable="RepeatableField({{ $data }}, {{ $optString }})">
    <input id="{{ $field->getId('-empty') }}"
        type="hidden"
        :name="fieldName"
        value="{{ $field->get('empty_array_value', '__EMPTY_ARRAY__') }}"
    />

    <table class="table">
        <thead>
        <tr>
            <template x-if="options.sortable">
                <th width="1%">#</th>
            </template>
            <th width="">
                {{ $field->getPlaceholder() }}
            </th>
            <template x-if="canModify">
                <th class="text-end" width="1%">
                    <button type="button" class="btn btn-sm btn-success btn-primary"
                        :disabled="!canAdd"
                        @click="addItem(-1)">
                        <span class="fa fa-plus"></span>
                    </button>
                </th>
            </template>
        </tr>
        </thead>
        <tbody x-ref="tbody"
            {{--            is="{{ $field->isSortable() ? 'draggable' : 'tbody' }}" --}}
            {{--            element="tbody"--}}
            {{--            :options="{ handle: '.drag-handle', animation: 300 }"--}}
        >
        <template x-for="(item, i) of items" :key="item.uid" x-ref="steps_template">
            <tr :data-item="item.uid" class="fadeIn" style="animation-duration: .3s">
                <template x-if="options.sortable">
                    <td>
                        <div class="h-handle" style="cursor: move;">
                            <span class="fa fa-ellipsis-v"></span>
                        </div>
                    </td>
                </template>
                <td class="">
                    <div class="d-grid p-2 {{ $gapClass }}" style="{{ $columnsStyle }}{{ $gapStyle }}">
                        @php($i = 0)
                        @foreach ($form->getFields() as $subField)
                            <div
                                style="{{ $subField instanceof HiddenField ? 'display: none;' : '' }}{{ $colWidth($subField, $i) }}"
                            >
                                <x-field :field="$subField"></x-field>
                            </div>
                            @php($i++)
                        @endforeach
                    </div>
                </td>
                <template x-if="canModify">
                    <td class="text-nowrap text-end" width="1%">
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
                </template>
            </tr>
        </template>
        </tbody>
    </table>

    <div class="d-none">
        <div {!! $inputElement::buildAttributes($inputElement->getAttributes(true)) !!}></div>
    </div>
</div>

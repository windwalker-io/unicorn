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
 * @var \Unicorn\Field\CascadeSelectField $field
 */

$app->service(\Unicorn\Script\FormScript::class)->cascadeSelect();

$config = [
    'id' => $field->getId(),
    'selected' => $selected,
    'path' => $path,
    'placeholder' => $field->getPlaceholder() ?: $lang('unicorn.select.placeholder'),
    'ignoreSelf' => $field->getIgnoreSelfValue(),
    'ajaxUrl' => ((string) $field->getAjaxUrl()) ?: null,
    'ajaxValueField' => $field->getAjaxValueField() ?: 'value',
    'source' => $field->getSourceValues(),
    'labels' => (array) $field->getLabels(),
    'labelWidth' => $field->getLabelWidth(),
    'fieldWidth' => $field->getFieldWidth(),
    'readonly' => $field->isReadonly(),
    'disabled' => $field->isDisabled(),
    'valueField' => $field->getValueField(),
    'textField' => $field->getTextField(),
    'horizontal' => (bool) $field->getHorizontal(),
    'horizontalColWidth' => $field->getHorizontalColWidth(),
    'defaultValue' => $field->getDefaultValue() ?? ''
];
$config = array_merge($config, (array) $field->getCascadeSelectOptions());
$configString = AssetService::getJSObject($config);
$inputElement ??= $field->getPreparedInput();

$inputElement->setAttribute(':value', 'getFinalValue')
?>

<div id="{{ $field->getId('-select-wrapper') }}"
    class="c-cascade-select"
    x-id="cascade-select"
    x-data="CascadeSelect({{ $configString}})"
    :class="[options.horizontal ? 'row' : '']"
    >
    <template x-for="(items, i) of lists" :key="items?.map(item => item[options.valueField]).join(',')">

        <div class="form-group row mb-2"
            :class="[options.horizontal ? (options.horizontalColWidth || 'col') : '']"
            :data-level="i"
        >
            <label :for="getId(i)" x-text="getLabel(i)"
                class="c-cascade-select__label mb-2"
                :class="options.labelWidth || 'col-md-3'"></label>

            <div class="col c-cascade-select__input">
                <select :id="getId(i)" :disabled="!canModify"
                    class="form-select custom-select"
                    x-init="selectInit($el)"
                    x-on:change="onChange(i, $event)"
                >
                    <option value="" x-text="options.placeholder"></option>
                    <template x-for="item of items" x-key="item[options.valueField]">
                        <option :value="item[options.valueField]" x-text="item[options.textField]"
                            :selected="isSelected(i, item)"
                        ></option>
                    </template>
                </select>
            </div>
        </div>
    </template>

    <div x-text="getFinalValue"></div>
    {!! $inputElement !!}
</div>

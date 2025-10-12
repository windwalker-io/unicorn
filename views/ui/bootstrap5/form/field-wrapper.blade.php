<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var $view      ViewModel       The view modal object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

use Unicorn\Form\BootstrapFormRenderer;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Utilities\Str;

/**
 * @var AbstractField $field
 * @var \Windwalker\DOM\HTMLElement $wrapper
 * @var \Windwalker\Edge\Component\ComponentAttributes $attributes
 */

BootstrapFormRenderer::handleFieldConfiguration($field);

// JS
$app->service(\Unicorn\Script\FormScript::class)->showOn($field);

$wrapper ??= $field->getPreparedWrapper();
// Options
$options = array_merge($field->getStates(), $options ?? []);

$wrapper->addClass('form-group');

if ($field instanceof \Windwalker\Form\Field\HiddenFieldInterface) {
    $wrapper->addClass('d-none');
    $noLabel = true;
}

// Attributes
$floating = $field->get('floating') ?? $attributes['floating'] ?? false;

if ($floating) {
    $field->set('floating', true);
} else {
    $wrapper->addClass('row');
}

$attrs = $wrapper->getAttributes(true);

$inputAttrs ??= [];
$labelAttrs ??= [];
$validate ??= [];

// Validation
$validate = array_merge(
    $field->get('validate') ?? [],
    $validate,
);

if ($attributes ?? null) {
    $attributes = $attributes->exceptProps(
        [
            'field',
            'options',
            'validate',
            'no-label',
            'input-attrs',
            'label-attrs',
            'horizon',
        ]
    );

    $attrs = $attributes->merge($attrs, false)->getAttributes();

    foreach ($attrs as $name => $value) {
        if (str_starts_with($name, 'input-')) {
            $inputAttrs[Str::removeLeft($name, 'input-', 'ascii')] = $value;
            unset($attrs[$name]);
        } elseif (str_starts_with($name, 'label-')) {
            $labelAttrs[Str::removeLeft($name, 'label-', 'ascii')] = $value;
            unset($attrs[$name]);
        }
    }

    // Count cols
    $horizon ??= null;

    if ($horizon) {
        [$labelCols, $inputCols] = explode(':', $horizon) + [null, null];
    } else {
        $inputCols = $attributes['input-cols'] ?? null;
        $labelCols = $attributes['label-cols'] ?? null;
    }

    if ($inputCols === null && $labelCols !== null) {
        $inputCols = 12 - $labelCols;
    }

    if ($inputCols !== null && $labelCols === null) {
        $labelCols = 12 - $inputCols;
    }

    $labelAttrs['class'] = ($labelAttrs['class'] ?? '') . ' col-md-' . ($labelCols ?? 12);
}

$noLabel ??= $options['no_label'] ?? false;
?>

<div {!! \Windwalker\DOM\HTMLElement::buildAttributes($attrs) !!}>
    @if (!$noLabel && !$floating)
        @if ($label ?? null)
            {!! $label(field: $field, options: $options) !!}
        @else
            <x-label :field="$field" :options="$options" :="$labelAttrs"></x-label>
        @endif
    @endif

    <div data-input-container uni-field-validate="{{ json_encode($validate) }}"
        class="position-relative {{ $floating ? 'form-floating' : 'col-md-' . ($inputCols ?? 12) }}">
        @if ($desc = $field->getDescription())
            <div class="c-input-help small text-muted mb-2">{!! $desc !!}</div>
        @endif

        @if (isset($start))
            {!! $start(field: $field, options: $options) !!}
        @endif

        @if ($defaultSlot ?? null)
            {!! $defaultSlot(field: $field, options: $options) !!}
        @else
            <x-input :field="$field" :options="$options" :="$inputAttrs"></x-input>

            @if (!$noLabel && $floating)
                @if ($label ?? null)
                    {!! $label(field: $field, options: $options) !!}
                @else
                    <x-label :field="$field" :options="$options" :="$labelAttrs"></x-label>
                @endif
            @endif
        @endif

        @if (isset($end))
            {!! $end(field: $field, options: $options) !!}
        @endif

        @if ($help = $field->get('help'))
            <div class="c-input-help small text-muted mt-2">{!! $help !!}</div>
        @endif

        @if ($error ?? null)
            {!! $error(field: $field, input: $inputElement) !!}
        @else
            <div data-field-error class="{{ $attributes['error-class'] ?? 'invalid-tooltip' }}"></div>
        @endif
    </div>
</div>

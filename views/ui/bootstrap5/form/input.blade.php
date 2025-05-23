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
use Windwalker\Edge\Component\ComponentAttributes;
use Windwalker\Form\Field\AbstractField;

/**
 * @var AbstractField              $field
 * @var \Windwalker\DOM\HTMLElement $input
 * @var array                      $options
 * @var ComponentAttributes        $attributes
 */

$inputElement ??= $field->getPreparedInput();
$options = array_merge($field->getStates(), $options ?? []);

$floating = $field->get('floating') ?? $attributes['floating'] ?? null;

if ($attributes ?? null) {
    $attributes = $attributes->exceptProps(['field', 'options']);
}

if ($inputElement instanceof \Windwalker\DOM\HTMLElement) {
    if ($attributes ?? null) {
        $attributes = $attributes->exceptProps(['field', 'options']);

        $attributes = $attributes->merge($inputElement->getAttributes(true), false);
        $inputElement->setAttributes($attributes->getAttributes());
    }

    BootstrapFormRenderer::handleInputClasses($field, $inputElement);
}

if ($floating) {
    $inputElement['placeholder'] ??= $field->getLabelName();
}

$fieldElement = $field->buildFieldElement($inputElement, $options);

// Append / Prepend
$prepend = $field->get('prepend');
if ($prepend && !is_array($prepend)) {
    $prepend = [$prepend];
}

$append = $field->get('append');
if ($append && !is_array($append)) {
    $append = [$append];
}

$inputGroup = $append || $prepend;

$printCustomHtml = static function (mixed $h) use ($app) {
    if ($h instanceof \Closure) {
        $h = $app->call($h);
    }

    return (string) $h;
};
?>

@if ($field instanceof \Windwalker\Form\Field\ListField && $field->isMultiple())
    <input id="{{ $field->getId('-empty') }}"
        type="hidden"
        name="{{ $field->getInputName() }}"
        value="{{ $field->get('empty_array_value', '__EMPTY_ARRAY__') }}"
    />
@endif

@if ($inputGroup)
    <x-input-group class="c-field-input-group">
        <x-slot name="start">
            @if ($prepend)
                @foreach ($prepend as $h)
                    {!! $printCustomHtml($h) !!}
                @endforeach
            @endif
        </x-slot>
        {!! $fieldElement !!}
        <x-slot name="end">
            @if ($append)
                @foreach ($append as $h)
                    {!! $printCustomHtml($h) !!}
                @endforeach
            @endif
        </x-slot>
    </x-input-group>
@else
    {!! $fieldElement !!}
@endif

@if ($end ?? null)
    {!! $end(field: $field, input: $inputElement) !!}
@endif

<?php

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

declare(strict_types=1);

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Form\FormRenderer;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Utilities\Str;

/**
 * @var AbstractField $field
 * @var \Windwalker\DOM\DOMElement $wrapper
 * @var \Windwalker\Edge\Component\ComponentAttributes $attributes
 */

$wrapper ??= $field->getPreparedWrapper();
$options = array_merge($field->getStates(), $options ?? []);

$wrapper->addClass('form-group');

// Attributes
$attrs = $wrapper->getAttributes(true);

$inputAttrs ??= [];
$labelAttrs ??= [];
$validateAttrs ??= [];

if ($attributes ?? null) {
    $attributes = $attributes->exceptProps(['field', 'options']);

    $attrs = $attributes->merge($attrs)->getAttributes();

    foreach ($attrs as $name => $value) {
        if (str_starts_with($name, 'input-')) {
            $newName = Str::removeLeft($name, 'input-');
            $inputAttrs[$newName] = $value;

            unset($attrs[$name]);
        } elseif (str_starts_with($name, 'label-')) {
            $newName = Str::removeLeft($name, 'label-');
            $labelAttrs[$newName] = $value;

            unset($attrs[$name]);
        } elseif (str_starts_with($name, 'validate-')) {
            $inputAttrs[$name] = $value;

            unset($attrs[$name]);
        }
    }
}

$noLabel ??= $options['no_label'] ?? false;
?>

<div {!! \Windwalker\DOM\HTMLElement::buildAttributes($attrs) !!}>
    @if (!$noLabel)
        @if ($label ?? null)
            {!! $label(field: $field, options: $options) !!}
        @else
            <x-label :field="$field" :options="$options" :="$labelAttrs"></x-label>
        @endif
    @endif
    @if ($defaultSlot ?? null)
        {!! $defaultSlot(field: $field, options: $options) !!}
    @else
        <x-input :field="$field" :options="$options" :="$inputAttrs"></x-input>
    @endif
</div>

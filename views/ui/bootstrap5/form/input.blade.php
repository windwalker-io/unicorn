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
 * @var AbstractField $field
 * @var \Windwalker\DOM\DOMElement $input
 * @var array $options
 * @var ComponentAttributes $attributes
 */

$inputElement ??= $field->getPreparedInput();
$options = array_merge($field->getStates(), $options ?? []);

$floating = $field->get('floating') ?? $attributes['floating'] ?? null;

if ($attributes ?? null) {
    $attributes = $attributes->exceptProps(['field', 'options']);
}

if ($inputElement instanceof \Windwalker\DOM\DOMElement) {
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
$prepend = (array) $field->get('prepend');
$append = (array) $field->get('append');

$inputGroup = $append || $prepend;
?>

@if ($inputGroup)
    <?php
    if (is_string($prepend)) {
        $prepend = \Windwalker\DOM\h('div', ['class' => 'input-group-text'], $prepend);
    }

    ?>
    <x-input-group class="c-field-input-group">
        <x-slot name="start">
        @foreach ($prepend as $h)
            <?php
                if (is_string($h)) {
                    $h = \Windwalker\DOM\h('div', ['class' => 'input-group-text'], $h);
                }

                echo $h;
            ?>
        @endforeach

        </x-slot>
        {!! $fieldElement !!}
        <x-slot name="end">
            @foreach ($append as $h)
                <?php
                if (is_string($h)) {
                    $h = \Windwalker\DOM\h('div', ['class' => 'input-group-text'], $h);
                }

                echo $h;
                ?>
            @endforeach
        </x-slot>
    </x-input-group>
@else
    {!! $fieldElement !!}
@endif

@if ($end ?? null)
    {!! $end(field: $field, input: $inputElement) !!}
@endif

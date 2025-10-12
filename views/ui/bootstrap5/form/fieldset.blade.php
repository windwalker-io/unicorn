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
use Windwalker\Form\Form;

/**
 * @var Form   $form
 * @var string $name
 * @var \Windwalker\Edge\Component\ComponentAttributes $attributes
 */
$name ??= null;
$fieldset = $name ? $form->getFieldset($name) : null;
$ns ??= '';

$is ??= 'div';
$title ??= $fieldset?->getTitle();
$floating ??= false;
$horizon ??= null;
$star ??= false;
$gap ??= 4;

$attributes = $attributes->exceptProps(
    [
        'form',
        'horizon',
        'start',
        'end',
        'title',
        'is',
        'floating',
        'star',
        'gap',
    ]
);

$attrs = [];

$attributes = $attributes->class('l-form-fieldset');
?>

<x-component :is="$is" :="$attributes" :title="$title">
    @if ($header ?? null)
        <x-slot name="header">
            {!! $header(title: $title, fieldset: $fieldset) !!}
        </x-slot>
    @endif

    {!! $start ?? '' !!}

    <div class="l-form-fieldset__body d-flex flex-column {{ $gap ? "gap-$gap" : '' }}">
        @foreach ($form->getFields($name, $ns) as $field)
            @php($fieldName = \Windwalker\Utilities\StrNormalize::toKebabCase($field->getNamespaceName()))
            @php($slotName = $fieldName . 'Slot')
            @php($startSlot = $fieldName . 'StartSlot')
            @php($endSlot = $fieldName . 'EndSlot')

            @if ($$startSlot ?? null)
                {!! $$startSlot(field: $field) !!}
            @endif

            @if ($main ?? null)
                {!! $main(field: $field) !!}
            @elseif ($$slotName ?? null)
                {!! $$slotName(field: $field) !!}
            @else
                <x-field :field="$field" class="" :floating="$floating" :star="$star"
                    :horizon="$horizon"
                    :="$attrs">
                    @if ($fieldSlot ?? null)
                        @scope($field)
                        {!! $fieldSlot(field: $field) !!}
                    @endif
                </x-field>
            @endif

            @if ($$endSlot ?? null)
                {!! $$endSlot(field: $field) !!}
            @endif
        @endforeach
    </div>

    {!! $end ?? '' !!}
</x-component>

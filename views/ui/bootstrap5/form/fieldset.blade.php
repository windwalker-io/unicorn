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
use Windwalker\Form\Form;

/**
 * @var Form   $form
 * @var string $name
 */
$name ??= null;
$fieldset = $name ? $form->getFieldset($name) : null;
$ns ??= '';

$is ??= 'div';
$title ??= $fieldset?->getTitle();
$floating ??= false;
?>

<x-component :is="$is" {{ $attributes }}>
    @if ($header ?? null)
        <x-slot name="header">
            {!! $header(title: $title, fieldset: $fieldset) !!}
        </x-slot>
    @elseif ($title)
        <x-slot name="title">
            {{ $title }}
        </x-slot>
    @endif

    @foreach ($form->getFields($name, $ns) as $field)
        @php($fieldName = \Windwalker\Utilities\StrNormalize::toKebabCase($field->getNamespaceName()))
        @php($slotName = $fieldName . 'Slot')
        @php($startSlot = $fieldName . 'StartSlot')
        @php($endSlot = $fieldName . 'EndSlot')

        @if ($$startSlot ?? null)
            {!! $$startSlot(field: $field) !!}
        @endif

        @if ($$slotName ?? null)
            {!! $$slotName(field: $field) !!}
        @else
            <x-field :field="$field" class="mb-3" :floating="$floating">
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
</x-component>

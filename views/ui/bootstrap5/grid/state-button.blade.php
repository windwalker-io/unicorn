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
 * @var \Unicorn\Html\State\StateButton $state
 * @var string $value
 * @var \Unicorn\Html\State\StateButton|array $states
 * @var \Windwalker\Edge\Component\ComponentAttributes $attributes
 */

$value = $states->normalizeValue($value ?? '');

$options ??= [];

if ($states instanceof \Unicorn\Html\State\StateButton) {
    $state = $states->getCompiledState($value, $options);
} else {
    $state = new \Unicorn\Html\State\StateOption($value);
    $state->merge($states[$value] ?? []);
    $state->merge($options);
}

$store ??= 'grid';
$size ??= 'sm';

$attributes = $attributes->exceptProps(['states']);

$color = \Windwalker\Utilities\Str::ensureLeft($state->getColor(), 'text-');
?>

@if ($state->isOnlyIcon())
    <span class="{{ $color }} {{ $state->getIcon() }} c-state-button c-state-button--icon"
        data-bs-toggle="tooltip"
        title="{{ $state->getHelp() }}"
        {!! $attributes !!}
    >
        @if (!empty($state->getText()))
            <span class="c-state-button__text {{ $state->getTextColor() }}">{{ $state->getText() }}</span>
        @endif
    </span>
@else
    <button type="button"
        class="c-state-button grid-boolean-icon disable-on-submit c-state-button--{{ $value ?? '' }} {{ $state->getButtonClass() }} btn-{{ $size }}"
        data-bs-toggle="tooltip"
        title="{{ $state->getHelp() }}"
        {!! $attributes !!}
        @attr('disabled', $state->isDisabled())

        @if (!empty($state->getOnclick()))
            @if (is_callable($state->getOnclick()))
                onclick="{{ $state->getOnclick()($value, $state, $options) }}"
            @else
                onclick="{!! $state->getOnclick() !!}"
            @endif
        @elseif ($state->getHref())
            @if (is_callable($state->getHref()))
                onclick="{{ $state->getHref()($value, $state, $options) }}"
            @else
                onclick="location.href = '{{ $state->getHref() }}'"
            @endif
        @elseif ($state->getTask())
            @if (is_callable($state->getTask()))
                @click="{{ $state->getTask()($value, $state, $options) }}"
            @else
                @click="$store.{{ $store }}.updateRowByTask('{{ $state->getTask() }}', '{{ $id ?? '' }}')"
            @endif
        @endif
    >
        <span class="c-state-button__icon {{ $color }} {{ $state->getIcon() }}"></span>

        @if (!empty($state->getText()))
            <span class="c-state-button__text {{ $state->getTextColor() }}">{{ $state->getText() }}</span>
        @endif
    </button>
@endif

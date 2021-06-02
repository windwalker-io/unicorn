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
 * @var \Unicorn\Html\State\StateButton $state
 * @var string $value
 * @var \Unicorn\Html\State\StateButton|array $states
 */
if ($states instanceof \Unicorn\Html\State\StateButton) {
    $state = $states->getCompiledState($value);
} else {
    $state = new \Unicorn\Html\State\StateOption($value);
    $state->merge($states[$value] ?? []);
}

$store ??= 'grid';
$size ??= 'sm';
?>

@if ($state->isOnlyIcon())
    <span class="{{ $state->getIcon() }} c-state-button c-state-button--icon"
        data-bs-toggle="tooltip"
        title="{{ $state->getHelp() }}"
    ></span>
@else
    <button type="button"
        class="c-state-button grid-boolean-icon disable-on-submit c-state-button--{{ $value ?? '' }} {{ $state->getButtonClass() }} btn-{{ $size }}"
        data-bs-toggle="tooltip"
        title="{{ $state->getHelp() }}"
        @attr('disabled', $state->isDisabled())

        @if (!empty($state->getOnclick()))
        onclick="{!! $state->getOnclick() !!}"
        @elseif ($state->getHref())
        onclick="location.href = '{{ $state->getHref() }}'"
        @elseif ($state->getTask())
        @click="$store.{{ $store }}.doTask('{{ $state->getTask() }}', {{ $id ?? '' }})"
        @endif
    >
        <span class="c-state-button__icon {{ $state->getIcon() }} text-{{ $state->getColor() }}"></span>

        @if (!empty($options['text']))
            <span class="c-state-button__text {{ $options['text_color'] ?? '' }}">{{ $options['text'] }}</span>
        @endif
    </button>
@endif

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
 * @var \Unicorn\Workflow\AbstractWorkflow|\Unicorn\Workflow\WorkflowController $workflow
 */

if ($workflow instanceof \Unicorn\Workflow\AbstractWorkflow) {
    $workflow = $workflow->getWorkflowController();
}

// show($workflow->getEnabledTransitions($value));

$store ??= 'grid';
$colorOn ??= 'button';
$size ??= 'sm';

$currentState = $workflow->getState($value) ?? new \Unicorn\Workflow\State($value);

if ($colorOn === 'button') {
    $btnColor = 'btn-' . $currentState->getColor();
    $textColor = '';
} elseif ($colorOn === 'text') {
    $btnColor = $btnColor ??= 'btn-light';
    $textColor = 'text-' . $currentState->getColor();
}
?>

<div class="dropdown c-state-dropdown">
    <button class="btn {{ $btnColor }} btn-{{ $size }} {{ $textColor }} dropdown-toggle c-state-dropdown__toggle"
        type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="{{ $currentState->getIcon() }}"></i>
        {{ $currentState->getTitle() }}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        @foreach ($workflow->getEnabledTransitions($value) as $transition)
            <li>
                <a class="dropdown-item" href="javascript://"
                    @click="$store.{{ $store }}.doTask('{{ $transition->getName() }}', '{{ $id }}')">
                    <i class="{{ $transition->getIcon() }}"></i>
                    {{ $transition->getTitle() ?? $transition->getName() }}
                </a>
            </li>
        @endforeach
    </ul>
</div>

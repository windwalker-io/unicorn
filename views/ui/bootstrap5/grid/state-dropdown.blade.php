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

use Unicorn\Html\State\StateButton;
use Unicorn\Workflow\AbstractWorkflow;
use Unicorn\Workflow\WorkflowController;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var StateButton         $state
 * @var string              $value
 * @var StateButton|array   $states
 * @var AbstractWorkflow    $workflow
 * @var AbstractWorkflow[]  $workflows
 * @var WorkflowController  $workflowCtrl
 */

$batch   ??= false;
$disabled ??= false;
$useStates ??= false;
$store   ??= 'grid';
$colorOn ??= 'button';
$size    ??= 'sm';
$value   ??= '';
$id   ??= '';
$noTitle ??= false;

$currentState = null;

$attributes = $attributes->exceptProps(
    [
        'states',
        'workflow',
        'id',
        'colorOn',
        'size',
        'store',
        'value',
        'textColor',
        'buttonStyle',
        'useStates',
        'disabled',
        'batch'
    ]
);

$workflows = $workflow;

if (!is_array($workflow)) {
    $workflows = [$workflow];
} elseif (!$batch) {
    throw new \InvalidArgumentException('Multiple workflows only supports "batch" mode.');
}

if ($batch) {
    $buttonColor = $buttonColor ??= 'btn-secondary';
    $textColor = '';
} else {
    $workflowCtrl = $workflow->getWorkflowController();

    if ($useStates) {
        $states ??= $workflow->getStateButton();
        $currentState = $workflowCtrl?->getState($value) ?? $states->getState($value);
    } else {
        $transitions = $workflowCtrl->getEnabledTransitions($value);
        $disabled = $disabled || !count($transitions);

        $currentState = $workflowCtrl->getState($value) ?? new \Unicorn\Workflow\State($value);
    }

    if ($colorOn === 'button') {
        $buttonColor = 'btn-' . $currentState?->getColor();
        $textColor   = '';
    } elseif ($colorOn === 'text') {
        $buttonColor = $buttonColor ??= 'btn-light';
        $textColor   = 'text-' . $currentState?->getColor();
    }
}

$fieldName = array_map(fn (AbstractWorkflow $w) => $w->getWorkflowController()->getField(), $workflows);

$buttonId ??= trim('c-state-dropdown-' . implode('-', $fieldName) . '-' . $id, '-');
?>

<div class="btn-group dropdown c-state-dropdown d-inline-block" {!! $attributes !!}>
    <button class="btn {{ $buttonColor }} btn-{{ $size }} d-flex align-items-center {{ $textColor }} dropdown-toggle c-state-dropdown__toggle w-100 {{ $noTitle ? 'has-tooltip' : '' }}"
        type="button"
        id="{{ $buttonId }}"
        data-bs-toggle="dropdown"
        data-toggle="dropdown"
        aria-expanded="false"
        style="{{ $buttonStyle ?? '' }}"
        title="{{ $currentState?->getTitle() }}"
        @attr('disabled', $disabled)
    >
        @if ($batch)
            {!! $slot ?? '' !!}
        @else
            <i class="{{ $currentState?->getIcon() ?? 'fa fa-question-circle' }}"></i>
            @if (!$noTitle)
                <span class="mr-auto me-auto ml-1 ms-1">{{ $currentState?->getTitle() ?? 'Unknown State' }}</span>
            @endif
        @endif
    </button>
    <ul class="dropdown-menu" aria-labelledby="{{ $buttonId }}">
        @php($k = 1)
        @foreach ($workflows as $name => $workflow)
            <?php
            $workflowCtrl = $workflow->getWorkflowController();

            if ($useStates) {
                $states ??= $workflow->getStateButton();
                $currentState = $workflowCtrl?->getState($value) ?? $states->getState($value);
            } else {
                $transitions = $workflowCtrl->getEnabledTransitions($value);
                $disabled = $disabled || !count($transitions);

                $currentState = $workflowCtrl->getState($value) ?? new \Unicorn\Workflow\State($value);
            }
            ?>

            @if (!is_numeric($name))
                <li><h6 class="dropdown-header">{{ $name }}</h6></li>
            @endif

            @if ($useStates)
                @foreach ($states?->getStates() as $state)
                    <li>
                        <a class="dropdown-item" href="javascript://"
                            @if ($batch)
                            @click="$store.{{ $store }}.form.patch(null, { batch: { '{{ $workflowCtrl->getField() }}': '{{ $state->getValue() }}' } })">
                            @else
                                @click="$store.{{ $store }}.updateItem('{{ $id }}', null, { batch: { '{{ $workflowCtrl->getField() }}': '{{ $state->getValue() }}' } })">
                            @endif
                            <i class="{{ $state->getIcon() }} text-{{ $state->getColor() }}"></i>
                            {{ $state->getTitle() ?? $state->getName() }}
                        </a>
                    </li>
                @endforeach
            @else
                @foreach ($transitions as $transition)
                    <li>
                        <a class="dropdown-item" href="javascript://"
                            @if ($batch)
                            @click="$store.{{ $store }}.batch('{{ $transition->getName() }}', null, { batch: { '{{ $workflowCtrl->getField() }}': '{{ $state->getValue() }}' } })">
                            @else
                                @click="$store.{{ $store }}.doTask('{{ $transition->getName() }}', '{{ $id }}')"
                            @endif
                            >
                            <i class="{{ $transition->getIcon() }} text-{{ $state->getColor() }}"></i>
                            {{ $transition->getTitle() ?? $transition->getName() }}
                        </a>
                    </li>
                @endforeach
            @endif

            @if ($k !== count($workflows))
                <li><hr class="dropdown-divider"></li>
            @endif
            @php($k++)
        @endforeach
    </ul>
</div>

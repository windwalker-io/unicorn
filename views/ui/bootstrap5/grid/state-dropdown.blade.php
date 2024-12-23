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

use Unicorn\Html\State\StateButton;
use Unicorn\Html\State\StateOption;
use Unicorn\Workflow\AbstractWorkflow;
use Unicorn\Workflow\Transition;
use Unicorn\Workflow\WorkflowController;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var StateButton        $state
 * @var string             $value
 * @var StateButton|array  $stateButton
 * @var AbstractWorkflow   $workflow
 * @var AbstractWorkflow[] $workflows
 * @var WorkflowController $workflowCtrl
 * @var Transition         $transition
 * @var \Closure           $prepareWorkflow
 * @var ?StateOption       $currentState
 */

?>

@if ($readonly)
    <?php
    $data = $prepareWorkflow($workflow);
    extract($data, EXTR_OVERWRITE);
    ?>
    @php($attributes = $attributes->class("d-inline-block $textColor text-nowrap"))
    <div {!! $attributes !!}>
        <i class="{{ $currentState?->getIcon() ?? 'fa fa-question-circle' }} fa-fw"></i>
        @if (!$noTitle)
            <span class="mr-auto me-auto ms-1">{{ $currentState?->getTitle() ?? 'Unknown State' }}</span>
        @endif
    </div>
@else
    @php($attributes = $attributes->class('dropdown c-state-dropdown d-inline-block'))
    <div {!! $attributes !!}>
        <button
            class="btn {{ $buttonColor }} btn-{{ $size }} d-flex align-items-center {{ $textColor }} dropdown-toggle c-state-dropdown__toggle w-100 {{ $noTitle ? 'has-tooltip' : '' }}"
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
                @if (isset($slot))
                    {!! $slot !!}
                @else
                    @if ($currentState?->getIcon())
                        <i class="{{ $currentState?->getIcon() ?? 'fa fa-question-circle' }} fa-fw"></i>
                    @endif
                    @if (!$noTitle)
                        <span class="mr-auto me-auto ms-1">{{ $currentState?->getTitle() ?? 'Unknown State' }}</span>
                    @endif
                @endif
            @endif
        </button>
        <ul class="dropdown-menu" aria-labelledby="{{ $buttonId }}">
            @if (isset($menuStart))
                {!! $menuStart(currentState: $currentState) !!}
            @endif
            @php($k = 1)
            @foreach ($workflows as $name => $workflow)
                <?php
                $data = $prepareWorkflow($workflow);

                extract($data);
                ?>

                @if (!is_numeric($name))
                    <li><h6 class="dropdown-header">{{ $name }}</h6></li>
                @endif

                @if ($useStates)
                    @foreach ($stateButton?->getStates() as $state)
                        <li>
                            <a class="dropdown-item" href="javascript://"
                                @if ($onclick)
                                    onclick="{{ $onclick($state, $workflowCtrl) }}"
                                @elseif ($batch)
                                    @click="$store.{{ $store }}.form.patch(null, { batch: { '{{ $workflowCtrl->getField() }}': '{{ $state->getValue() }}' } })">
                                @else
                                    @click="$store.{{ $store }}.updateItem('{{ $id }}', null, { batch: { '{{ $workflowCtrl->getField() }}': '{{ $state->getValue() }}' } })">
                                @endif
                                @if ($state->getIcon())
                                    <i class="{{ $state->getIcon() }} fa-fw text-{{ $state->getColor() }}"></i>
                                @endif
                                {{ $state->getTitle() ?? $state->getValue() }}
                            </a>
                        </li>
                    @endforeach
                @else
                    @foreach ($transitions as $transition)
                        <li>
                            <a class="dropdown-item" href="javascript://"
                                @if ($onclick)
                                    onclick="{{ $onclick($transition, $workflowCtrl) }}"
                                @elseif ($batch)
                                    @click="$store.{{ $store }}.batch('{{ $transition->getName() }}', null, { batch: { '{{ $workflowCtrl->getField() }}': '{{ $state->getValue() }}' } })">
                                @else
                                    @click="$store.{{ $store }}.updateItem('{{ $id }}', null, { batch: { '{{ $workflowCtrl->getField() }}': '{{ $transition->getTo() }}' } })"
                                @endif
                                >
                                @if ($transition->getIcon())
                                    <i class="fa-fw {{ $transition->getIcon() }}"></i>
                                @endif
                                {{ $transition->getTitle() ?: $transition->getName() }}
                            </a>
                        </li>
                    @endforeach
                @endif

                @if ($k !== count($workflows))
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                @endif
                @php($k++)
            @endforeach

            @if (isset($menuEnd))
                {!! $menuEnd(currentState: $currentState) !!}
            @endif
        </ul>
    </div>
@endif

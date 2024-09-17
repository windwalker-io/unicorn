<?php

declare(strict_types=1);

namespace Unicorn\Component;

use Closure;
use Unicorn\Html\State\StateButton;
use Unicorn\Workflow\State;
use Unicorn\Workflow\WorkflowController;
use Unicorn\Workflow\WorkflowInterface;
use Windwalker\Core\Edge\Attribute\EdgeComponent;
use Windwalker\Edge\Component\AbstractComponent;
use Windwalker\Utilities\Attributes\Prop;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

use function Windwalker\value;

#[EdgeComponent('state-dropdown')]
class StateDropdownComponent extends AbstractComponent
{
    use InstanceCacheTrait;

    #[Prop]
    public bool $batch = false;

    #[Prop]
    public bool $disabled = false;

    #[Prop]
    public bool $readonly = false;

    #[Prop]
    public bool $useStates = false;

    #[Prop]
    public WorkflowInterface|StateButton|null $states = null;

    #[Prop]
    public WorkflowInterface|WorkflowController|array|null $workflow = null;

    #[Prop]
    public string $store = 'grid';

    #[Prop]
    public string $colorOn = 'button';

    #[Prop]
    public string $size = 'sm';

    #[Prop]
    public mixed $value = '';

    #[Prop]
    public ?string $buttonStyle = null;

    #[Prop]
    public ?string $buttonColor = null;

    #[Prop]
    public ?string $textColor = null;

    #[Prop]
    public ?string $id = null;

    #[Prop]
    public bool $noTitle = false;

    #[Prop]
    public ?object $entity = null;

    #[Prop]
    public ?string $field = null;

    #[Prop]
    public ?string $onclick = null;

    public function data(): array
    {
        $this->value = value($this->value);

        $buttonColor = null;
        $textColor = null;
        $workflowCtrl = null;
        $currentState = null;
        $disabled = $this->disabled;

        $workflows = $this->workflow;

        if (!is_array($this->workflow)) {
            $workflows = [$this->workflow];
        } elseif (!$this->batch) {
            throw new \InvalidArgumentException('Multiple workflows only supports "batch" mode.');
        }

        if ($this->batch) {
            $color = 'secondary';
            $this->buttonColor ??= 'btn-' . $color;
        } else {
            $workflowCtrl = $this->compile($this->workflow);

            if ($this->useStates) {
                $stateButton ??= $workflowCtrl->getStateButton();
                $currentState = $workflowCtrl->getState($this->value) ?? $stateButton->getState($this->value);
            } else {
                $transitions = $workflowCtrl->getEnabledTransitions($this->value);
                $currentState = $workflowCtrl->getState($this->value) ?? new State($this->value);

                $disabled = $disabled || !count($transitions);
            }
        }

        $color = $currentState?->getColor();

        if ($this->colorOn === 'button') {
            $buttonColor = 'btn-' . $color;
        } elseif ($this->colorOn === 'text') {
            $buttonColor = $this->buttonColor ?? 'btn-light';
            $textColor = 'text-' . $color;
        }

        $fieldName = array_map(
            fn($w) => $this->compile($w)->getField(),
            $workflows
        );

        $buttonId ??= trim('c-state-dropdown-' . implode('-', $fieldName) . '-' . $this->id, '-');

        return array_merge(
            parent::data(),
            compact(
                'workflows',
                'workflowCtrl',
                'buttonColor',
                'textColor',
                'buttonId',
                'currentState',
                'disabled'
            )
        );
    }

    public function render(): Closure|string
    {
        return '@state-dropdown';
    }

    public function prepareWorkflow(WorkflowInterface|WorkflowController $workflow): array
    {
        $workflowCtrl = $this->compile($workflow);
        $stateButton = null;
        $transitions = [];

        if ($this->useStates) {
            $stateButton ??= $workflowCtrl->getStateButton();
        } else {
            $transitions = $workflowCtrl->getEnabledTransitions($this->value);
        }

        return compact(
            'workflowCtrl',
            'stateButton',
            'transitions'
        );
    }

    protected function compile(WorkflowInterface|WorkflowController $workflow): WorkflowController
    {
        if ($workflow instanceof WorkflowController) {
            return $workflow;
        }

        return $this->cacheStorage[$workflow::class] ??= $workflow->compile($this->entity, $this->field);
    }
}

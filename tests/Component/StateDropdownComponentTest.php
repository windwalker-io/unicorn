<?php

declare(strict_types=1);

namespace Unicorn\Tests\Component;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Component\StateDropdownComponent;
use Unicorn\Html\State\StateButton;
use Unicorn\Workflow\WorkflowController;

final class StateDropdownComponentTest extends TestCase
{
    #[Test]
    public function usesCurrentStateColorAndSupportsStateMode(): void
    {
        $workflow = new WorkflowController('status');
        $workflow->addState('published')->color('success')->title('Published');

        $component = new StateDropdownComponent();
        $component->workflow = $workflow;
        $component->value = 'published';
        $component->useStates = true;

        $data = $component->data();

        self::assertSame($workflow, $data['workflowCtrl']);
        self::assertSame('Published', $data['currentState']->getTitle());
        self::assertSame('btn-success', $data['buttonColor']);
        self::assertFalse($data['disabled']);
        self::assertSame('c-state-dropdown-status', $data['buttonId']);
    }

    #[Test]
    public function batchModeSupportsMultipleWorkflowsAndUsesSecondaryColor(): void
    {
        $workflows = [
            new WorkflowController('status'),
            new WorkflowController('visibility'),
        ];

        $component = new StateDropdownComponent();
        $component->workflow = $workflows;
        $component->batch = true;

        $data = $component->data();

        self::assertSame($workflows, $data['workflows']);
        self::assertSame('btn-secondary', $data['buttonColor']);
        self::assertSame('c-state-dropdown-status-visibility', $data['buttonId']);
        self::assertFalse($data['disabled']);
    }

    #[Test]
    public function rejectsMultipleWorkflowsOutsideBatchMode(): void
    {
        $component = new StateDropdownComponent();
        $component->workflow = [
            new WorkflowController('status'),
            new WorkflowController('visibility'),
        ];

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessageIs('Multiple workflows only supports "batch" mode.');

        $component->data();
    }

    #[Test]
    public function preparesStateButtonsOrEnabledTransitions(): void
    {
        $workflow = new WorkflowController('status');
        $workflow->addState('draft')->title('Draft');
        $workflow->addState('published')->title('Published');
        $workflow->addTransition('publish', 'draft', 'published');

        $component = new StateDropdownComponent();
        $component->useStates = true;
        $stateData = $component->prepareWorkflow($workflow);

        self::assertInstanceOf(StateButton::class, $stateData['stateButton']);
        self::assertSame([], $stateData['transitions']);

        $component->useStates = false;
        $transitionData = $component->prepareWorkflow($workflow);

        self::assertNull($transitionData['stateButton']);
        self::assertCount(1, $transitionData['transitions']);
    }

    #[Test]
    public function resolvesTheStateDropdownView(): void
    {
        self::assertSame('@state-dropdown', new StateDropdownComponent()->render());
    }
}

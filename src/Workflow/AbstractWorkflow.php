<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Unicorn\Html\State\StateButton;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\DOM\DOMElement;

/**
 * The Workflow class.
 *
 * @deprecated  Use WorkflowInterface and WorkflowTrait instead.
 */
abstract class AbstractWorkflow implements WorkflowInterface
{
    use TranslatorTrait;
    use WorkflowTrait;

    protected ?WorkflowController $workflowController = null;

    public function prepare(WorkflowController $workflow, ?object $entity): void
    {
        $this->configure($workflow);
    }

    abstract public function configure(WorkflowController $workflow): void;

    /**
     * @deprecated  Use getController() instead.
     */
    public function getWorkflowController(array $options = []): WorkflowController
    {
        if ($this->workflowController === null) {
            $options = array_merge($this->options, $options);
            $this->setWorkflowController($this->createController($this->getField(), $options));
        }

        return $this->workflowController;
    }

    public function compile(
        ?object $entity = null,
        ?string $field = null,
        array $options = []
    ): WorkflowController {
        return $this->getWorkflowController();
    }

    /**
     * @deprecated  Deprecate without replacement.
     */
    public function setWorkflowController(WorkflowController $workflowController): static
    {
        $this->configure($workflowController);

        $this->workflowController = $workflowController;

        return $this;
    }

    public function getStateValues(): array
    {
        return $this->getWorkflowController()->getStateValues();
    }

    /**
     * getStates
     *
     * @return  array<State>
     */
    public function getStates(): array
    {
        return $this->getWorkflowController()->getStates();
    }

    /**
     * @deprecated  Use WorkflowController instead.
     */
    public function getStateOptions(array $attrs = []): array
    {
        $options = [];

        foreach ($this->getStates() as $state) {
            $attrs['value'] = $state->getValue();

            $options[] = DOMElement::create(
                'option',
                $attrs,
                $state->getTitle() ?? $state->getValue(),
            );
        }

        return $options;
    }

    /**
     * @deprecated  Use WorkflowController instead.
     */
    public function getStateButton(): StateButton
    {
        $button = new StateButton();

        foreach ($this->getStates() as $value => $state) {
            $button->addState((string) $value)
                ->icon($state->getIcon())
                ->color($state->getColor())
                ->title($state->getTitle());
        }

        return $button;
    }
}

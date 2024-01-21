<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Unicorn\Html\State\StateButton;
use Unicorn\Workflow\Exception\TransitionDisallowException;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\DOM\DOMElement;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\BeforeSaveEvent;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\ORM\Metadata\EntityMetadata;
use Windwalker\Utilities\TypeCast;

/**
 * The Workflow class.
 */
abstract class AbstractWorkflow implements WorkflowInterface
{
    use TranslatorTrait;
    use WorkflowTrait;

    protected ?WorkflowController $workflowController = null;

    protected string $property = '';

    public function compile(WorkflowController $workflow, ?object $entity): void
    {
        $this->configure($workflow);
    }

    abstract public function configure(WorkflowController $workflow): void;

    /**
     * @deprecated  Use getController() instead.
     */
    public function getWorkflowController(): WorkflowController
    {
        if ($this->workflowController === null) {
            $this->setWorkflowController(new WorkflowController($this->lang));
        }

        return $this->workflowController;
    }

    public function getController(?object $entity = null, ?string $field = null): WorkflowController
    {
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

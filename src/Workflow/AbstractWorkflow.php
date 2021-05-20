<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Workflow;

use Unicorn\Workflow\Exception\TransitionException;
use Windwalker\DOM\DOMElement;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\ORM\Metadata\EntityMetadata;

/**
 * The Workflow class.
 */
abstract class AbstractWorkflow
{
    protected ?WorkflowController $workflowController = null;

    protected string $property = '';

    abstract public function configure(WorkflowController $workflow): void;

    public static function toStrings(mixed $value): string|array
    {
        if (is_array($value)) {
            return array_map('strval', $value);
        }

        return (string) $value;
    }

    public function listen(EntityMetadata $metadata): void
    {
        $workflow = $this->getWorkflowController();

        $metadata->watch(
            $workflow->getField(),
            function (WatchEvent $event) use ($metadata, $workflow) {
                $originEvent = $event->getOriginEvent();

                if (!$originEvent instanceof AfterSaveEvent) {
                    return;
                }

                $val = static::toStrings($event->getValue());
                $oldVal = static::toStrings($event->getOldValue());

                if (!$workflow->isAllow($oldVal, $val)) {
                    throw new TransitionException(
                        sprintf(
                            'Unallow transition from %s to %s',
                            json_encode($val),
                            json_encode($oldVal)
                        )
                    );
                }

                $workflow->triggerChanged($oldVal, $val, $event);
            }
        );
    }

    /**
     * @return WorkflowController
     */
    public function getWorkflowController(): WorkflowController
    {
        if ($this->workflowController === null) {
            $this->setWorkflowController(new WorkflowController());
        }

        return $this->workflowController;
    }

    /**
     * @param  WorkflowController  $workflowController
     *
     * @return  static  Return self to support chaining.
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
}
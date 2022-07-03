<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Workflow;

use Unicorn\Html\State\StateButton;
use Unicorn\Workflow\Exception\TransitionDisallowException;
use Windwalker\DOM\DOMElement;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\BeforeSaveEvent;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\ORM\Metadata\EntityMetadata;
use Windwalker\Utilities\TypeCast;

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
            return array_map([TypeCast::class, 'toString'], $value);
        }

        return TypeCast::toString($value);
    }

    public function listen(EntityMetadata $metadata): void
    {
        $workflow = $this->getWorkflowController();

        $metadata->watchBefore(
            $workflow->getField(),
            function (WatchEvent $event) use ($metadata, $workflow) {
                $to = static::toStrings($event->getValue());
                $from = static::toStrings($event->getOldValue());

                if (!$workflow->isAllow($from, $to)) {
                    throw new TransitionDisallowException(
                        $from,
                        $to,
                        $this,
                        sprintf(
                            'Transition from "%s" to "%s" is disallow.',
                            json_encode($from),
                            json_encode($to)
                        )
                    );
                }

                // Find transition
                $transition = $workflow->findTransition($from, $to);

                if ($transition) {
                    $workflow->triggerBeforeTransition($transition->getName(), $event);
                }

                $workflow->triggerAfterChanged($from, $to, $event);
            }
        );

        $metadata->watchAfter(
            $workflow->getField(),
            function (WatchEvent $event) use ($metadata, $workflow) {
                $val = static::toStrings($event->getValue());
                $oldVal = static::toStrings($event->getOldValue());

                // Find transition
                $transition = $workflow->findTransition($oldVal, $val);

                if ($transition) {
                    $workflow->triggerAfterTransition($transition->getName(), $event);
                }

                $workflow->triggerAfterChanged($oldVal, $val, $event);
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

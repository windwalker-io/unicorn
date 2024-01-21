<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Unicorn\Workflow\Exception\TransitionDisallowException;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\ORM\Metadata\EntityMetadata;
use Windwalker\Utilities\TypeCast;

trait WorkflowTrait
{
    use TranslatorTrait;

    protected ?string $field = null;

    protected WorkflowController $controller;

    abstract public function compile(WorkflowController $workflow, ?object $entity): void;

    public function getController(?object $entity = null, ?string $field = null): WorkflowController
    {
        $controller = new WorkflowController();
        $controller->setField($field);
        $this->compile($controller, $entity);

        return $controller;
    }

    public static function toStrings(mixed $value): string|array
    {
        if (is_array($value)) {
            return array_map(TypeCast::toString(...), $value);
        }

        return TypeCast::toString($value);
    }

    public function listen(EntityMetadata $metadata, ?string $field = null): void
    {
        $field ??= $this->field ?? throw new \LogicException('Workflow has no field.');

        $metadata->watchBefore(
            $field,
            function (WatchEvent $event) use ($field) {
                $workflow = $this->getController($event->getTempEntity(), $field);

                $to = static::toStrings($event->getValue());
                $from = static::toStrings($event->getOldValue());

                $toTitle = $workflow->getState($to)?->getTitle() ?? $to;
                $fromTitle = $workflow->getState($from)?->getTitle() ?? $from;

                if (!$workflow->isAllow($from, $to)) {
                    throw new TransitionDisallowException(
                        $from,
                        $to,
                        $this,
                        $this->trans(
                            'unicorn.workflow.error.transition.disallow',
                            from: $fromTitle,
                            to: $toTitle
                        )
                    );
                }

                // Do not use transition event since it will call listener twice
                // Find transition
                // $transition = $workflow->findTransition($from, $to);
                //
                // if ($transition) {
                //     $workflow->triggerBeforeTransition($transition->getName(), $event);
                // }

                $workflow->triggerBeforeChanged($from, $to, $event);
            }
        );

        $metadata->watchAfter(
            $field,
            function (WatchEvent $event) {
                $workflow = $this->getController($event->getTempEntity());

                $val = static::toStrings($event->getValue());
                $oldVal = static::toStrings($event->getOldValue());

                // Do not use transition event since it will call listener twice
                // Find transition
                // $transition = $workflow->findTransition($oldVal, $val);
                //
                // if ($transition) {
                //     $workflow->triggerAfterTransition($transition->getName(), $event);
                // }

                $workflow->triggerAfterChanged($oldVal, $val, $event);
            }
        );
    }

    public function getField(): ?string
    {
        return $this->field;
    }

    public function setField(?string $field): static
    {
        $this->field = $field;

        return $this;
    }
}

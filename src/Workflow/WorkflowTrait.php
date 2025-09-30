<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Unicorn\Workflow\Exception\TransitionDisallowException;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\ORM\Metadata\EntityMetadata;
use Windwalker\Utilities\Options\OptionAccessTrait;
use Windwalker\Utilities\TypeCast;

trait WorkflowTrait
{
    use TranslatorTrait;
    use OptionAccessTrait;

    protected ?string $field = null;

    protected bool $strict = false;

    protected ?string $defaultEnum = null;

    protected WorkflowController $controller;

    abstract public function prepare(WorkflowController $workflow, ?object $entity): void;

    public function compile(
        ?object $entity = null,
        ?string $field = null,
        array $options = []
    ): WorkflowController {
        $field = $field ?: $this->field;

        if (!$field) {
            throw new \LogicException('Trying to get WorkflowController without field.');
        }

        $options = array_merge($this->options, $options);
        $controller = $this->createController($field, $options);
        $this->prepare($controller, $entity);

        return $controller;
    }

    public static function toStrings(mixed $value): string|array
    {
        if (is_array($value)) {
            return array_map(TypeCast::toString(...), $value);
        }

        return TypeCast::toString($value);
    }

    public function listen(EntityMetadata $metadata, ?string $field = null, array $options = []): void
    {
        $field ??= $this->field ?? throw new \LogicException('Workflow has no field.');

        $metadata->watchBefore(
            $field,
            function (WatchEvent $event) use ($options, $field) {
                $workflow = $this->compile($event->tempEntity, $field, $options);

                $to = static::toStrings($event->value);
                $from = static::toStrings($event->oldValue);

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
            function (WatchEvent $event) use ($options, $field) {
                $workflow = $this->compile($event->tempEntity, $field, $options);

                $val = static::toStrings($event->value);
                $oldVal = static::toStrings($event->oldValue);

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

    public function isStrict(): bool
    {
        return $this->strict;
    }

    public function setStrict(bool $strict): static
    {
        $this->strict = $strict;

        return $this;
    }

    public function getDefaultEnum(): ?string
    {
        return $this->defaultEnum;
    }

    public function setDefaultEnum(?string $defaultEnum): static
    {
        $this->defaultEnum = $defaultEnum;

        return $this;
    }

    protected function createController(
        string $field,
        array $options = []
    ): WorkflowController {
        $controller = new WorkflowController($field, $options);

        if ($this->getDefaultEnum()) {
            $controller->registerStatesFromEnum($this->getDefaultEnum(), $this->lang);
        }

        $controller->allowFreeTransitions(!$this->isStrict());

        return $controller;
    }
}

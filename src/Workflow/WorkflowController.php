<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Workflow;

use Windwalker\Core\Event\CoreEventAwareTrait;
use Windwalker\Event\EventAwareInterface;
use Windwalker\Event\EventAwareTrait;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\Utilities\TypeCast;

/**
 * The Workflow class.
 */
class WorkflowController implements EventAwareInterface
{
    use CoreEventAwareTrait;

    protected bool $allowFreeTransitions = true;

    protected string $field = '';

    /**
     * @var array<State>
     */
    protected array $states = [];

    /**
     * @var array<Transition>
     */
    protected array $transitions = [];

    /**
     * getAvailableStates
     *
     * @param  array|string  $froms
     *
     * @return  array<State>
     */
    public function getAvailableStates(array|string $froms): array
    {
        $transitions = $this->getEnabledTransitions($froms);

        $tos = [];

        foreach ($transitions as $transition) {
            $tos[] = $transition->getTo();
        }

        // Add self
        $tos = [
            ...$tos,
            ...((array) $froms)
        ];

        $tos = array_unique($tos);
        $states = [];

        foreach ($tos as $to) {
            if ($state = $this->getState($to)) {
                $states[$to] = $state;
            }
        }

        return $states;
    }

    public function getInitialStates(): array
    {
        return array_filter(
            $this->getStates(),
            fn(State $state) => $state->isInitial()
        );
    }

    /**
     * getEnabledTransitions
     *
     * @param  array|string  $froms
     *
     * @return  array<Transition>
     */
    public function getEnabledTransitions(array|string $froms): array
    {
        if ($this->isAllowFreeTransitions()) {
            return array_filter(
                $this->getTransitions(),
                static fn(Transition $transition) => $transition->isEnabled()
            );
        }

        return array_filter(
            $this->transitions,
            static function (Transition $transition) use ($froms) {
                return $transition->isEnabled()
                    && array_intersect(
                        (array) AbstractWorkflow::toStrings($transition->getFroms()),
                        (array) AbstractWorkflow::toStrings($froms)
                    );
            },
        );
    }

    public function isTransitionExists(string $name): bool
    {
        return $this->getTransition($name) !== null;
    }

    public function isAllow(string|array $froms, string $to): bool
    {
        // Is same state, allow.
        if ($froms === $to || (array) $froms === (array) $to) {
            return true;
        }

        if ($this->isAllowFreeTransitions()) {
            $states = $this->getStateValues();

            return !(array_diff((array) $froms, $states) || array_diff((array) $to, $states));
        }

        return $this->findTransition($froms, $to) !== null;
    }

    public function addState(mixed $state, ?string $name = null, bool $isInitial = false): State
    {
        if (!$state instanceof State) {
            $state = new State(TypeCast::toString($state), $name, $isInitial);
        }

        $this->states[$state->getValue()] = $state;

        return $state;
    }

    public function addStates(array $states): static
    {
        foreach ($states as $state) {
            $this->addState($state);
        }

        return $this;
    }

    public function addTransition(
        string|Transition $transition,
        mixed $froms = null,
        mixed $to = null,
        bool $enabled = true,
    ): Transition {
        if (!$transition instanceof Transition) {
            if ($froms === null) {
                $froms = $this->getStateValues();
            }

            if ($froms instanceof \Stringable) {
                $froms = (string) $froms;
            }

            $froms = AbstractWorkflow::toStrings($froms);

            $to = TypeCast::toString($to);

            $transition = new Transition($transition, $froms, $to, $enabled);
        }

        return $this->transitions[$transition->getName()] = $transition;
    }

    public function findTransition(array|string $froms, string $to): ?Transition
    {
        foreach ($this->transitions as $transition) {
            if (
                $transition->getTo() === $to
                && !array_diff((array) $froms, (array) $transition->getFroms())
            ) {
                return $transition;
            }
        }

        return null;
    }

    public function triggerBeforeTransition(string $name, WatchEvent $event): object
    {
        $transition = $this->getTransition($name);

        if (!$transition) {
            throw new \LogicException(
                sprintf(
                    'Transition "%s" not found.',
                    $name
                )
            );
        }

        return $this->emit(
            (new TransitionEvent())
                ->setName('before_transition__' . $transition->getName())
                ->setFroms($transition->getFroms())
                ->setTo($transition->getTo())
                ->setTransition($transition)
                ->setWatchEvent($event)
        );
    }

    public function triggerAfterTransition(string $name, WatchEvent $event): object
    {
        $transition = $this->getTransition($name);

        if (!$transition) {
            throw new \LogicException(
                sprintf(
                    'Transition "%s" not found.',
                    $name
                )
            );
        }

        return $this->emit(
            (new TransitionEvent())
                ->setName('after_transition__' . $transition->getName())
                ->setFroms($transition->getFroms())
                ->setTo($transition->getTo())
                ->setTransition($transition)
                ->setWatchEvent($event)
        );
    }

    public function triggerBeforeChanged(string $from, string $to, WatchEvent $event): object
    {
        return $this->emit(
            (new TransitionEvent())
                ->setName($this->toEventName('before', $from, $to))
                ->setFroms($from)
                ->setTo($to)
                ->setWatchEvent($event)
        );
    }

    public function triggerAfterChanged(string $from, string $to, WatchEvent $event): object
    {
        return $this->emit(
            (new TransitionEvent())
                ->setName($this->toEventName('after', $from, $to))
                ->setFroms($from)
                ->setTo($to)
                ->setWatchEvent($event)
        );
    }

    public function onBeforeTransition(string $name, callable $listener): static
    {
        $transition = $this->getTransition($name);

        if ($transition) {
            $this->onBeforeChanged($transition->getFroms(), $transition->getTo(), $listener);

            // Do not use transition event since it will call listener twice
            // $this->on(
            //     'before_transition__' . $transition->getName(),
            //     $listener
            // );
        }

        return $this;
    }

    public function onAfterTransition(string $name, callable $listener): static
    {
        $transition = $this->getTransition($name);

        if ($transition) {
            $this->onAfterChanged($transition->getFroms(), $transition->getTo(), $listener);

            // Do not use transition event since it will call listener twice
            // $this->on(
            //     'after_transition__' . $transition->getName(),
            //     $listener
            // );
        }

        return $this;
    }

    public function onBeforeChanged(
        string|array|\Stringable $froms,
        string|array|\Stringable $tos,
        callable $listener
    ): static {
        $eventNames = $this->sortEventNames(
            'before',
            $froms,
            $tos
        );

        foreach ($eventNames as $eventName) {
            $this->on(
                $eventName,
                $listener
            );
        }

        return $this;
    }

    public function onAfterChanged(
        string|array|\Stringable $froms,
        string|array|\Stringable $tos,
        callable $listener
    ): static {
        $eventNames = $this->sortEventNames(
            'after',
            $froms,
            $tos
        );

        foreach ($eventNames as $eventName) {
            $this->on(
                $eventName,
                $listener
            );
        }

        return $this;
    }

    public function onBeforeFrom(string|array|\Stringable $froms, callable $listener): static
    {
        return $this->onBeforeChanged(
            $froms,
            $this->getStateValues(),
            $listener
        );
    }

    public function onAfterFrom(string|array|\Stringable $froms, callable $listener): static
    {
        return $this->onAfterChanged(
            $froms,
            $this->getStateValues(),
            $listener
        );
    }

    public function onBeforeTo(string|array|\Stringable $tos, callable $listener): static
    {
        return $this->onBeforeChanged(
            $this->getStateValues(),
            $tos,
            $listener
        );
    }

    public function onAfterTo(string|array|\Stringable $tos, callable $listener): static
    {
        return $this->onAfterChanged(
            $this->getStateValues(),
            $tos,
            $listener
        );
    }

    /**
     * @param  string|array|\Stringable  $froms
     * @param  string|array|\Stringable  $tos
     *
     * @return  array<string>
     */
    protected function sortEventNames(
        string $prefix,
        string|array|\Stringable $froms,
        string|array|\Stringable $tos
    ): array {
        $froms = (array) AbstractWorkflow::toStrings($froms);
        $tos = (array) AbstractWorkflow::toStrings($tos);

        $eventNames = [];

        foreach ($froms as $from) {
            foreach ($tos as $to) {
                $eventNames[] = $this->toEventName($prefix, $from, $to);
            }
        }

        return array_unique($eventNames);
    }

    protected function toEventName(string $prefix, string $from, string $to): string
    {
        return "{$prefix}__{$from}__to__{$to}";
    }

    public function setStateTitles(array $titles): static
    {
        foreach ($titles as $state => $title) {
            $this->getState((string) $state)?->title($title);
        }

        return $this;
    }

    public function setStateMeta(mixed $value, string $title = '', string $icon = '', string $color = ''): static
    {
        $state = $this->getState((string) $value);

        if (!$state) {
            return $this;
        }

        $state->title($title);
        $state->icon($icon);
        $state->color($color);

        return $this;
    }

    public function setInitialStates(array $states): static
    {
        foreach ($states as $state) {
            $this->getState((string) $state)?->setIsInitial(true);
        }

        return $this;
    }

    public function getState(string $value): ?State
    {
        return $this->states[$value] ?? null;
    }

    /**
     * @return State[]
     */
    public function getStates(): array
    {
        return $this->states;
    }

    /**
     * @param  State[]  $states
     *
     * @return  static  Return self to support chaining.
     */
    public function setStates(array $states): static
    {
        $this->states = [];

        $this->addStates($states);

        return $this;
    }

    public function getStateValues(): array
    {
        $values = [];

        foreach ($this->getStates() as $state) {
            $values[] = $state->getValue();
        }

        return $values;
    }

    /**
     * @return bool
     */
    public function isAllowFreeTransitions(): bool
    {
        return $this->allowFreeTransitions;
    }

    /**
     * @param  bool  $allowFreeTransitions
     *
     * @return  static  Return self to support chaining.
     */
    public function setAllowFreeTransitions(bool $allowFreeTransitions): static
    {
        $this->allowFreeTransitions = $allowFreeTransitions;

        return $this;
    }

    /**
     * @return string
     */
    public function getField(): string
    {
        return $this->field;
    }

    /**
     * @param  string  $field
     *
     * @return  static  Return self to support chaining.
     */
    public function setField(string $field): static
    {
        $this->field = $field;

        return $this;
    }

    /**
     * @return Transition[]
     */
    public function getTransitions(): array
    {
        return $this->transitions;
    }

    public function getTransition(string $name): ?Transition
    {
        return $this->transitions[$name] ?? null;
    }

    /**
     * @param  Transition[]  $transitions
     *
     * @return  static  Return self to support chaining.
     */
    public function setTransitions(array $transitions): static
    {
        $this->transitions = [];

        foreach ($transitions as $transition) {
            $this->addTransition($transition);
        }

        return $this;
    }
}

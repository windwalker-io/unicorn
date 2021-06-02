<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Workflow;

use Windwalker\Event\EventAwareInterface;
use Windwalker\Event\EventAwareTrait;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\Utilities\Arr;

/**
 * The Workflow class.
 */
class WorkflowController implements EventAwareInterface
{
    use EventAwareTrait;

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
            $tos[] = (array) $transition->getTos();
        }

        // Add self
        $tos[] = (array) $froms;

        $tos = array_unique(array_merge(...$tos));
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
            fn (State $state) => $state->isInitial()
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
                fn (Transition $transition) => $transition->isEnabled()
            );
        }

        return array_filter(
            $this->transitions,
            fn(Transition $transition) => $transition->isEnabled()
                && Arr::arrayEquals((array) $transition->getFroms(), (array) $froms),
        );
    }

    public function isTransitionExists(string $name): bool
    {
        return $this->getTransition($name) !== null;
    }

    public function isAllow(string|array $froms, string|array $tos): bool
    {
        if ($froms === $tos) {
            return true;
        }

        if ($this->isAllowFreeTransitions()) {
            $states = $this->getStateValues();

            return !(array_diff((array) $froms, $states) || array_diff((array) $tos, $states));
        }

        foreach ($this->transitions as $transition) {
            if (
                Arr::arrayEquals((array) $transition->getFroms(), (array) $froms)
                && Arr::arrayEquals((array) $transition->getTos(), (array) $tos)
            ) {
                return true;
            }
        }

        return false;
    }

    public function addState(string|\Stringable|State $state, ?string $name = null, bool $isInitial = false): static
    {
        if (!$state instanceof State) {
            $state = new State((string) $state, $name, $isInitial);
        }

        $this->states[$state->getValue()] = $state;

        return $this;
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
        mixed $tos = null,
        bool $enabled = true,
    ): Transition {
        if (!$transition instanceof Transition) {
            if ($froms instanceof \Stringable) {
                $froms = (string) $froms;
            }

            if ($tos instanceof \Stringable) {
                $tos = (string) $tos;
            }

            $transition = new Transition($transition, $froms, $tos, $enabled);
        }

        return $this->transitions[$transition->getName()] = $transition;
    }

    protected function validateTransition(Transition $transition)
    {
        //
    }

    public function triggerTransition(string $name, WatchEvent $event): object
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
                ->setName($this->toEventName($transition->getFroms(), $transition->getTos()))
                ->setFroms($transition->getFroms())
                ->setTos($transition->getTos())
                ->setTransition($transition)
                ->setWatchEvent($event)
        );
    }

    public function triggerChanged(string|array $froms, string|array $tos, WatchEvent $event): object
    {
        return $this->emit(
            (new TransitionEvent())
                ->setName($this->toEventName($froms, $tos))
                ->setFroms($froms)
                ->setTos($tos)
                ->setWatchEvent($event)
        );
    }

    public function onTransition(string $name, callable $listener): static
    {
        $transition = $this->getTransition($name);

        if ($transition) {
            $this->onChanged($transition->getFroms(), $transition->getTos(), $listener);
        }

        return $this;
    }

    public function onChanged(
        string|array|\Stringable $froms,
        string|array|\Stringable $tos,
        callable $listener
    ): static {
        $this->on(
            $this->toEventName($froms, $tos),
            $listener
        );

        return $this;
    }

    protected function toEventName(string|array|\Stringable $froms, string|array|\Stringable $tos): string
    {
        $froms = AbstractWorkflow::toStrings($froms);
        $tos   = AbstractWorkflow::toStrings($tos);

        $froms = (array) $froms;
        $tos   = (array) $tos;

        sort($froms);
        sort($tos);

        return implode(';', (array) $froms) . '=>' . implode(';', (array) $tos);
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

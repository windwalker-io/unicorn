<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use MyCLabs\Enum\Enum;
use Unicorn\Html\State\StateButton;
use Windwalker\Core\Event\CoreEventAwareTrait;
use Windwalker\DOM\HTMLElement;
use Windwalker\Event\EventAwareInterface;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\Utilities\Contract\LanguageInterface;
use Windwalker\Utilities\Enum\EnumMetaInterface;
use Windwalker\Utilities\Options\OptionAccessTrait;
use Windwalker\Utilities\TypeCast;

/**
 * The Workflow class.
 */
class WorkflowController implements EventAwareInterface
{
    use CoreEventAwareTrait;
    use OptionAccessTrait;

    protected bool $allowFreeTransitions = true;

    /**
     * @var array<State>
     */
    protected array $states = [];

    /**
     * @var array<Transition>
     */
    protected array $transitions = [];

    public function __construct(protected string $field, array $options = [])
    {
        $this->options = $options;
    }

    public function registerStatesFromEnum(string|object|iterable $enum, ?LanguageInterface $lang = null): static
    {
        $states = [];

        if (
            is_a($enum, \UnitEnum::class, true)
            || is_a($enum, Enum::class, true)
        ) {
            $states = $enum::values();
        } elseif (is_iterable($enum)) {
            $states = TypeCast::toArray($enum);
        }

        $this->addStates($states, $lang);

        return $this;
    }

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
            ...((array) $froms),
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

    public function addState(
        mixed $state,
        ?string $name = null,
        bool $isInitial = false,
        ?LanguageInterface $lang = null
    ): State {
        if (!$state instanceof State) {
            $value = $state;

            $state = new State(TypeCast::toString($value), $name, $isInitial);

            if ($value instanceof EnumMetaInterface) {
                $state->title($value->getTitle($lang))
                    ->icon($value->getIcon())
                    ->color($value->getColor());
            }
        }

        $this->states[$state->getValue()] = $state;

        return $state;
    }

    public function addStates(array $states, ?LanguageInterface $lang = null): static
    {
        foreach ($states as $state) {
            $this->addState($state, lang: $lang);
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
            $froms = $this->expandStatesFromAny($froms);

            if (is_array($to)) {
                throw new \InvalidArgumentException('addTransition() arg 2 $to must not be array.');
            }

            $to = TypeCast::toString($to);

            $froms = array_filter($froms, static fn(string $state) => $state !== $to);

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
            new TransitionEvent(
                watchEvent: $event,
                froms: $transition->getFroms(),
                to: $transition->getTo(),
                transition: $transition
            )
                ->setName('before_transition__' . $transition->getName())
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
            new TransitionEvent(
                watchEvent: $event,
                froms: $transition->getFroms(),
                to: $transition->getTo(),
                transition: $transition
            )
                ->setName('after_transition__' . $transition->getName())
        );
    }

    public function triggerBeforeChanged(string $from, string $to, WatchEvent $event): object
    {
        return $this->emit(
            new TransitionEvent(
                watchEvent: $event,
                froms: $from,
                to: $to,
            )
                ->setName($this->toEventName('before', $from, $to))
        );
    }

    public function triggerAfterChanged(string $from, string $to, WatchEvent $event): object
    {
        return $this->emit(
            new TransitionEvent(
                watchEvent: $event,
                froms: $from,
                to: $to,
            )
                ->setName($this->toEventName('after', $from, $to))
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
        mixed $froms,
        mixed $tos,
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
        mixed $froms,
        mixed $tos,
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

    public function onBeforeFrom(mixed $froms, callable $listener): static
    {
        return $this->onBeforeChanged(
            $froms,
            $this->getStateValues(),
            $listener
        );
    }

    public function onAfterFrom(mixed $froms, callable $listener): static
    {
        return $this->onAfterChanged(
            $froms,
            $this->getStateValues(),
            $listener
        );
    }

    public function onBeforeTo(mixed $tos, callable $listener): static
    {
        return $this->onBeforeChanged(
            $this->getStateValues(),
            $tos,
            $listener
        );
    }

    public function onAfterTo(mixed $tos, callable $listener): static
    {
        return $this->onAfterChanged(
            $this->getStateValues(),
            $tos,
            $listener
        );
    }

    /**
     * @param  mixed  $froms
     * @param  mixed  $tos
     *
     * @return  array<string>
     */
    protected function sortEventNames(
        string $prefix,
        mixed $froms,
        mixed $tos
    ): array {
        $froms = $this->expandStatesFromAny($froms);
        $tos = $this->expandStatesFromAny($tos);

        $eventNames = [];

        foreach ($froms as $from) {
            foreach ($tos as $to) {
                $eventNames[] = $this->toEventName($prefix, $from, $to);
            }
        }

        return array_unique($eventNames);
    }

    protected function expandStatesFromAny(mixed $states): array
    {
        if ($states === null || $states === '*') {
            $states = $this->getStateValues();
        }

        return (array) AbstractWorkflow::toStrings($states);
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
        $state = $this->getState(TypeCast::toString($value));

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
            $this->getState(TypeCast::toString($state))?->setIsInitial(true);
        }

        return $this;
    }

    public function getState(mixed $value): ?State
    {
        $value = TypeCast::toString($value);

        return $this->states[$value] ?? null;
    }

    public function mustGetState(mixed $value): State
    {
        return $this->getState($value);
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
    public function setStates(array $states, ?LanguageInterface $lang = null): static
    {
        $this->states = [];

        $this->addStates($states, $lang);

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
        return $this->allowFreeTransitions($allowFreeTransitions);
    }

    public function allowFreeTransitions(bool $allowFreeTransitions): static
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

    public function getStateOptions(array $attrs = []): array
    {
        $options = [];

        foreach ($this->getStates() as $state) {
            $attrs['value'] = $state->getValue();

            $options[] = HTMLElement::create(
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

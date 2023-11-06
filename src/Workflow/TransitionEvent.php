<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Windwalker\Event\AbstractEvent;
use Windwalker\ORM\Event\WatchEvent;

/**
 * The TransitionEvent class.
 */
class TransitionEvent extends AbstractEvent
{
    protected string|array $froms = [];

    protected string $to = '';

    protected ?Transition $transition = null;

    protected WatchEvent $watchEvent;

    /**
     * @return array|string
     */
    public function getFroms(): array|string
    {
        return $this->froms;
    }

    /**
     * @param  array|string  $froms
     *
     * @return  static  Return self to support chaining.
     */
    public function setFroms(array|string $froms): static
    {
        $this->froms = $froms;

        return $this;
    }

    /**
     * @return string
     */
    public function getTo(): string
    {
        return $this->to;
    }

    /**
     * @param  string  $to
     *
     * @return  static  Return self to support chaining.
     */
    public function setTo(string $to): static
    {
        $this->to = $to;

        return $this;
    }

    /**
     * @return Transition|null
     */
    public function getTransition(): ?Transition
    {
        return $this->transition;
    }

    /**
     * @param  Transition|null  $transition
     *
     * @return  static  Return self to support chaining.
     */
    public function setTransition(?Transition $transition): static
    {
        $this->transition = $transition;

        return $this;
    }

    /**
     * @return WatchEvent
     */
    public function getWatchEvent(): WatchEvent
    {
        return $this->watchEvent;
    }

    /**
     * @param  WatchEvent  $watchEvent
     *
     * @return  static  Return self to support chaining.
     */
    public function setWatchEvent(WatchEvent $watchEvent): static
    {
        $this->watchEvent = $watchEvent;

        return $this;
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Windwalker\Event\BaseEvent;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\Utilities\Accessible\AccessorBCTrait;

/**
 * The TransitionEvent class.
 */
class TransitionEvent extends BaseEvent
{
    use AccessorBCTrait;

    public array $fromArray {
        get => is_array($this->froms) ? $this->froms : [$this->froms];
    }

    public function __construct(
        public WatchEvent $watchEvent,
        public string|array $froms = [],
        public string $to = '',
        public ?Transition $transition = null,
    ) {
    }
}

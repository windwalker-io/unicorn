<?php

declare(strict_types=1);

namespace Unicorn\Selector\Event;

use Unicorn\Selector\ListSelector;
use Windwalker\Event\BaseEvent;
use Windwalker\ORM\SelectorQuery;
use Windwalker\Utilities\Accessible\AccessorBCTrait;

/**
 * The AbstractSelectorEvent class.
 */
abstract class AbstractSelectorEvent extends BaseEvent
{
    use AccessorBCTrait;

    public function __construct(
        public SelectorQuery $query,
        public ListSelector $selector
    ) {
    }
}

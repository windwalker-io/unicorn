<?php

declare(strict_types=1);

namespace Unicorn\Selector\Event;

use Unicorn\Selector\ListSelector;
use Windwalker\Event\AbstractEvent;
use Windwalker\ORM\SelectorQuery;

/**
 * The AbstractSelectorEvent class.
 */
abstract class AbstractSelectorEvent extends AbstractEvent
{
    protected SelectorQuery $query;

    protected ListSelector $selector;

    /**
     * @return SelectorQuery
     */
    public function getQuery(): SelectorQuery
    {
        return $this->query;
    }

    /**
     * @param  SelectorQuery  $query
     *
     * @return  static  Return self to support chaining.
     */
    public function setQuery(SelectorQuery $query): static
    {
        $this->query = $query;

        return $this;
    }

    /**
     * @return ListSelector
     */
    public function getSelector(): ListSelector
    {
        return $this->selector;
    }

    /**
     * @param  ListSelector  $selector
     *
     * @return  static  Return self to support chaining.
     */
    public function setSelector(ListSelector $selector): static
    {
        $this->selector = $selector;

        return $this;
    }
}

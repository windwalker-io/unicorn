<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository\Event;

/**
 * The AfterBatchEvent class.
 */
#[\Attribute]
class AfterBatchEvent extends AbstractBatchEvent
{
    /**
     * @var array<object>
     */
    protected array $items = [];

    /**
     * @return object[]
     */
    public function getItems(): array
    {
        return $this->items;
    }

    /**
     * @param  object[]  $items
     *
     * @return  static  Return self to support chaining.
     */
    public function setItems(array $items): static
    {
        $this->items = $items;

        return $this;
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Attributes;

#[\Attribute(\Attribute::TARGET_CLASS)]
class NewOrdering
{
    public const FIRST = 'first';
    public const LAST = 'last';

    public function __construct(public readonly string $order)
    {
        if (!in_array($this->order, [static::FIRST, static::LAST], true)) {
            throw new \InvalidArgumentException('The order parameter must be `first` or `last`');
        }
    }

    public function isFirst(): bool
    {
        return $this->order === static::FIRST;
    }

    public function isLast(): bool
    {
        return $this->order === static::LAST;
    }
}

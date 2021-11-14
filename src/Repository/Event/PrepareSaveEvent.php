<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository\Event;

use Windwalker\Event\AbstractEvent;

/**
 * The PrepareSaveEvent class.
 */
#[\Attribute]
class PrepareSaveEvent extends AbstractEvent
{
    protected array $data = [];
    
    protected array|object $source = [];
    
    protected array|string|null $condFields = null;

    protected int $options = 0;

    /**
     * @return array|object
     */
    public function &getSource(): object|array
    {
        return $this->source;
    }

    /**
     * @param  array|object  $source
     *
     * @return  static  Return self to support chaining.
     */
    public function setSource(object|array $source): static
    {
        $this->source = $source;

        return $this;
    }

    /**
     * @return array|string|null
     */
    public function getCondFields(): array|string|null
    {
        return $this->condFields;
    }

    /**
     * @param  array|string|null  $condFields
     *
     * @return  static  Return self to support chaining.
     */
    public function setCondFields(array|string|null $condFields): static
    {
        $this->condFields = $condFields;

        return $this;
    }

    /**
     * @return int
     */
    public function getOptions(): int
    {
        return $this->options;
    }

    /**
     * @param  int  $options
     *
     * @return  static  Return self to support chaining.
     */
    public function setOptions(int $options): static
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @return array
     */
    public function &getData(): array
    {
        return $this->data;
    }

    /**
     * @param  array  $data
     *
     * @return  static  Return self to support chaining.
     */
    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }
}

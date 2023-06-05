<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository\Event;

use Unicorn\Repository\Actions\BatchAction;
use Windwalker\Event\AbstractEvent;
use Windwalker\ORM\ORM;

/**
 * The AbstractBatchEvent class.
 */
abstract class AbstractBatchEvent extends AbstractEvent
{
    protected array $ids = [];

    protected string $task = '';

    protected array $data = [];

    protected ORM $orm;

    protected BatchAction $action;

    /**
     * @return string
     */
    public function getTask(): string
    {
        return $this->task;
    }

    /**
     * @param  string  $task
     *
     * @return  static  Return self to support chaining.
     */
    public function setTask(string $task): static
    {
        $this->task = $task;

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

    /**
     * @return ORM
     */
    public function getORM(): ORM
    {
        return $this->orm;
    }

    /**
     * @param  ORM  $orm
     *
     * @return  static  Return self to support chaining.
     */
    public function setORM(ORM $orm): static
    {
        $this->orm = $orm;

        return $this;
    }

    /**
     * @return BatchAction
     */
    public function getAction(): BatchAction
    {
        return $this->action;
    }

    /**
     * @param  BatchAction  $action
     *
     * @return  static  Return self to support chaining.
     */
    public function setAction(BatchAction $action): static
    {
        $this->action = $action;

        return $this;
    }

    /**
     * @return array
     */
    public function &getIds(): array
    {
        return $this->ids;
    }

    /**
     * @param  array  $ids
     *
     * @return  static  Return self to support chaining.
     */
    public function setIds(array $ids): static
    {
        $this->ids = $ids;

        return $this;
    }
}

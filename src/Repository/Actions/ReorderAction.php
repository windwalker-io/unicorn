<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Windwalker\Data\Collection;
use Windwalker\Query\Query;

/**
 * The ReorderAction class.
 */
class ReorderAction extends AbstractDatabaseAction
{
    protected string $orderField = 'ordering';

    /**
     * @var \Closure|array
     */
    protected \Closure|array $reorderGroupHandler;

    public function move(array $ids, int $delta, ?string $orderField = null): bool
    {
        if (!$ids || !$delta) {
            return true;
        }

        $mapper = $this->getEntityMapper();
        $orderField ??= $this->getOrderField();
        $key = $mapper->getMainKey();

        foreach ($ids as $id) {
            $item = $mapper->findOne($id, Collection::class);

            if (!$item) {
                continue;
            }

            $query = $mapper->select();

            $this->groupConditions($query, $item);

            $neighborQuery = clone $query;

            if ($delta > 0) {
                // Move down
                $neighborQuery->where($orderField, '>', $item->$orderField);
                $dir = 'ASC';
            } else {
                // Move up
                $neighborQuery->where($orderField, '<', $item->$orderField);
                $dir = 'DESC';
            }

            $neighbor = $neighborQuery->order($orderField, $dir)
                ->get(Collection::class);

            if (!$neighbor) {
                continue;
            }

            // Switch with target item
            $mapper->updateBatch(
                [$orderField => (int) $neighbor->$orderField],
                [$key => $item->$key]
            );

            $mapper->updateBatch(
                [$orderField => (int) $item->$orderField],
                [$key => $neighbor->$key]
            );

            $this->reorderAll($query, $orderField);
        }

        return true;
    }

    public function reorder(array $orders = [], ?string $orderField = null)
    {
        if ($orders === []) {
            return true;
        }

        $conditions = [];
        $mapper = $this->getEntityMapper();
        $orderField ??= $this->getOrderField();
        $key = $mapper->getMainKey();

        foreach ($orders as $id => $orderNumber) {
            $mapper->updateBatch(
                [$orderField => $orderNumber],
                [$key => $id]
            );


        }
    }

    public function reorderAll(Query $query, ?string $orderField = null)
    {

    }

    /**
     * @return string
     */
    public function getOrderField(): string
    {
        return $this->orderField;
    }

    /**
     * @param  string  $orderField
     *
     * @return  static  Return self to support chaining.
     */
    public function setOrderField(string $orderField): static
    {
        $this->orderField = $orderField;

        return $this;
    }

    public function groupConditions(Query $query, Collection $item): Query
    {
        $handler = $this->getReorderGroupHandler();

        if (is_array($handler)) {
            $conditions = [];

            foreach ($handler as $field) {
                $conditions[] = [$field, '=', $item->$field];
            }

            $query->where($conditions);
        } else {
            $result = $handler($query, $entity = $this->getEntityMapper()->toEntity($item));

            if ($result !== null) {
                $query->where($result);
            }
        }

        return $query;
    }

    /**
     * @return \Closure|array
     */
    public function getReorderGroupHandler(): \Closure|array
    {
        return $this->reorderGroupHandler;
    }

    /**
     * @param  \Closure|array  $reorderGroupHandler
     *
     * @return  static  Return self to support chaining.
     */
    public function setReorderGroupHandler(\Closure|array $reorderGroupHandler): static
    {
        $this->reorderGroupHandler = $reorderGroupHandler;

        return $this;
    }
}

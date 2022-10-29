<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
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
    protected \Closure|array|null $reorderGroupHandler = null;

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

            $this->reorderByQuery($query, $orderField);
        }

        return true;
    }

    public function reorder(array $orders = [], ?string $orderField = null): bool
    {
        if ($orders === []) {
            return true;
        }

        $cache = [];
        $mapper = $this->getEntityMapper();
        $orderField ??= $this->getOrderField();
        $key = $mapper->getMainKey();

        foreach ($orders as $id => $orderNumber) {
            $item = $mapper->findOne($id, Collection::class);

            if (!$item) {
                continue;
            }

            $item->$orderField = $orderNumber;

            $mapper->updateOne($item);

            $query = $mapper->select();

            $this->groupConditions($query, $item);

            $hash = md5($query->render(true));

            $cache[$hash] ??= [$item->$key, $query];
        }

        foreach ($cache as [$id, $query]) {
            $this->reorderByQuery($query, $orderField);
        }

        return true;
    }

    public function reorderAllForItem(object $item, ?string $orderField = null): bool
    {
        $mapper = $this->getEntityMapper();
        $orderField ??= $this->getOrderField();

        $query = $mapper->select();

        $this->groupConditions($query, $mapper->toCollection($item));

        $this->reorderByQuery($query, $orderField);

        return true;
    }

    public function getMaxOrdering(Collection|array $item, ?string $orderField = null): ?string
    {
        $orderField ??= $this->getOrderField();

        $mapper = $this->getEntityMapper();
        $query = $mapper->select();

        $this->groupConditions($query, Collection::wrap($item));

        return $query->selectRaw('MAX(%n) AS max_ordering', $orderField)->result();
    }

    public function reorderByQuery(Query $query, ?string $orderField = null): bool
    {
        $orderField ??= $this->getOrderField();

        $mapper = $this->getEntityMapper();
        $query = clone $query;
        $query->order($orderField, 'ASC');

        foreach ($query->getIterator(Collection::class) as $i => $item) {
            $item->$orderField = $i + 1;

            $mapper->updateOne($item);
        }

        return true;
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

    public function canReorder(?string $field = null): bool
    {
        $field ??= $this->getOrderField();
        $metadata = $this->getEntityMapper()->getMetadata();

        return $metadata->getColumn($field) !== null;
    }

    public function groupConditions(Query $query, Collection $item): Query
    {
        $handler = $this->getReorderGroupHandler();

        if ($handler === null) {
            return $query;
        }

        if (is_array($handler)) {
            $conditions = [];

            foreach ($handler as $field) {
                $conditions[] = [$field, '=', $item->$field];
            }

            $query->where($conditions);
        } else {
            $result = $handler($query, $this->getEntityMapper()->toEntity($item));

            if ($result !== null) {
                $query->where($result);
            }
        }

        return $query;
    }

    /**
     * @return \Closure|array
     */
    public function getReorderGroupHandler(): \Closure|array|null
    {
        return $this->reorderGroupHandler;
    }

    /**
     * Can be:
     * - Array: [...fields]
     * - Callback: function ($query, $entity)
     *     Return: Everything Query::where(columns) params format.
     *
     * @param  \Closure|array  $reorderGroupHandler
     *
     * @return  static  Return self to support chaining.
     */
    public function setReorderGroupHandler(\Closure|array|null $reorderGroupHandler): static
    {
        $this->reorderGroupHandler = $reorderGroupHandler;

        return $this;
    }
}

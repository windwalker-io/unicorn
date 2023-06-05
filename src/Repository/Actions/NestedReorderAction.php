<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Windwalker\ORM\Nested\NestedEntityInterface;
use Windwalker\ORM\NestedSetMapper;
use Windwalker\Query\Query;

/**
 * The NestedReorderAction class.
 */
class NestedReorderAction extends ReorderAction
{
    public function reorderByQuery(Query $query, ?string $orderField = null): bool
    {
        /** @var NestedSetMapper $mapper */
        $mapper = $this->getEntityMapper();

        $mapper->rebuild();

        return true;
    }

    public function move(array $ids, int $delta, ?string $orderField = null): bool
    {
        if (!$ids || !$delta) {
            return true;
        }

        /** @var NestedSetMapper $mapper */
        $mapper = $this->getEntityMapper();

        $groupHandler = $this->getReorderGroupHandler();

        foreach ($ids as $id) {
            /** @var NestedEntityInterface $item */
            $item = $mapper->findOne($id, $mapper->getMetadata()->getClassName());

            if (!$item) {
                continue;
            }

            $conditions = $groupHandler
                ? fn(Query $query) => $this->getReorderGroupHandler()($query, $item)
                : [];

            $mapper->move($item, $delta, $conditions);
        }

        return true;
    }
}

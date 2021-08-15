<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
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

        foreach ($ids as $id) {
            /** @var NestedEntityInterface $item */
            $item = $mapper->findOne($id, $mapper->getMetadata()->getClassName());

            if (!$item) {
                continue;
            }

            $mapper->move($item, $delta);
        }

        return true;
    }
}

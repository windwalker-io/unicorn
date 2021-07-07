<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Windwalker\ORM\Nested\NestedEntityInterface;
use Windwalker\ORM\Nested\Position;
use Windwalker\ORM\NestedSetMapper;

/**
 * The NestedSaveAction class.
 */
class NestedSaveAction extends SaveAction
{
    public function save(object|array $data, array|string $condFields = null, int $options = 0): object
    {
        /** @var NestedSetMapper $mapper */
        /** @var NestedEntityInterface $entity */
        /** @var NestedEntityInterface $oldEntity */
        $mapper = $this->getEntityMapper();
        $entity = $this->getEntityMapper()->toEntity($data);

        $oldEntity = $entity->getPrimaryKeyValue()
            ? $mapper->findOne($entity->getPrimaryKeyValue())
            : null;

        if (
            $mapper->isNew($entity)
            || ($oldEntity && $oldEntity->getParentId() !== $entity->getParentId())
        ) {
            $mapper->setPosition($entity, $entity->getParentId(), Position::LAST_CHILD);
        }

        $entity = $this->getEntityMapper()->saveOne($entity, $condFields, $options);

        if ($mapper->isPathable()) {
            $mapper->rebuildPath($entity);
        }

        return $entity;
    }
}

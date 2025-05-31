<?php

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Unicorn\Repository\Event\PrepareSaveEvent;
use Windwalker\ORM\Nested\NestedEntityInterface;
use Windwalker\ORM\Nested\Position;
use Windwalker\ORM\NestedSetMapper;

/**
 * The NestedSaveAction class.
 */
class NestedSaveAction extends SaveAction
{
    public function save(object|array $data, array|string|null $condFields = null, int $options = 0): object
    {
        $source = $data;

        /** @var NestedSetMapper $mapper */
        /** @var NestedEntityInterface $entity */
        /** @var NestedEntityInterface $oldEntity */
        $mapper = $this->getEntityMapper();

        // If is object, extract it.
        // If is array, do not extract again since EntityMapper::extract() will cast values.
        if (is_object($data)) {
            $data = $this->getEntityMapper()->extract($data);
        }

        $event = $this->emit(
            new PrepareSaveEvent(data: $data, source: $source, condFields: $condFields, options: $options)
        );

        $data = $event->data;
        $key = $mapper->getMainKey();

        $pk = $data[$key] ?? null;

        $oldEntity = $pk ? $mapper->findOne($pk) : null;

        $entity = $oldEntity ?: $mapper->createEntity();
        $entity = $mapper->hydrate($data, $entity);

        if (
            $mapper->isNew($entity)
            || ($oldEntity && (string) $oldEntity->getParentId() !== (string) $entity->getParentId())
        ) {
            $mapper->setPosition($entity, $entity->getParentId(), Position::LAST_CHILD);
        }

        $entity = $this->getEntityMapper()
            ->saveOne(
                $mapper->hydrate($data, $entity),
                $event->condFields,
                $event->options
            );

        if ($mapper->isPathable()) {
            $mapper->rebuildPath($entity);
        }

        return $entity;
    }
}

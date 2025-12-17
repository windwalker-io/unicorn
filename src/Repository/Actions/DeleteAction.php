<?php

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Unicorn\Model\Contract\SoftDeleteEntityInterface;

class DeleteAction extends AbstractDatabaseAction
{
    public function delete(mixed $conditions): void
    {
        $mapper = $this->getEntityMapper();

        $entityClass = $mapper->getMetadata()->getClassName();

        if (is_a($entityClass, SoftDeleteEntityInterface::class, true)) {
            /** @var SoftDeleteEntityInterface $entity */
            foreach ($mapper->findList($conditions) as $entity) {
                $entity->setIsDeleted(true);

                $mapper->updateOne($entity);
            }

            return;
        }

        $mapper->deleteBatch($conditions);
    }
}

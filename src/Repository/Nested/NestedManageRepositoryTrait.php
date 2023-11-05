<?php

declare(strict_types=1);

namespace Unicorn\Repository\Nested;

use Unicorn\Attributes\ConfigureAction;
use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\NestedReorderAction;
use Unicorn\Repository\Actions\NestedSaveAction;
use Unicorn\Repository\Actions\ReorderAction;
use Unicorn\Repository\Event\AfterBatchEvent;
use Unicorn\Repository\Event\AfterBatchItemEvent;
use Unicorn\Repository\ManageRepositoryTrait;
use Windwalker\ORM\NestedSetMapper;

/**
 * The NestedManageRepositoryTrait class.
 */
trait NestedManageRepositoryTrait
{
    use ManageRepositoryTrait;

    public function createSaveAction(string $actionClass = NestedSaveAction::class): NestedSaveAction
    {
        return $this->createAction($actionClass, $this);
    }

    public function createReorderAction(string $actionClass = NestedReorderAction::class): NestedReorderAction
    {
        return $this->createAction($actionClass, $this);
    }

    #[ConfigureAction(ReorderAction::class, ConfigureAction::IS_INSTANCE_OF)]
    protected function configureNestedReorderAction(ReorderAction $action): void
    {
        $action->setOrderField('lft');
    }

    #[AfterBatchEvent]
    public function afterBatchForNested(AfterBatchEvent $event)
    {
        $data = $event->getData();

        if ($data['parent_id'] ?? null) {
            /** @var NestedSetMapper $mapper */
            $mapper = $event->getORM()->mapper($this->getEntityClass());

            $mapper->rebuild();

            foreach ($event->getIds() as $id) {
                $mapper->rebuildPath($id);
            }
        }
    }
}

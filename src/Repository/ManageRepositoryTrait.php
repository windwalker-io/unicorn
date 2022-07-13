<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\ReorderAction;
use Unicorn\Repository\Actions\SaveAction;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\BeforeSaveEvent;

/**
 * Trait ManageRepositoryTrait
 */
trait ManageRepositoryTrait
{
    use CrudRepositoryTrait;

    public function createReorderAction(string $actionClass = ReorderAction::class): ReorderAction
    {
        return $this->createAction($actionClass, $this);
    }

    public function createBatchAction(string $actionClass = BatchAction::class): BatchAction
    {
        return $this->createAction($actionClass, $this);
    }

    public function newOrderLast(SaveAction $action): void
    {
        $action->beforeSave(
            function (BeforeSaveEvent $event) {
                $reorderAction = $this->createReorderAction();
                $data = &$event->getData();

                if (
                    $reorderAction->canReorder()
                    && $event->isCreate()
                    && empty($data[$reorderAction->getOrderField()])
                ) {
                    $max = (int) $reorderAction->getMaxOrdering(
                        $event->getORM()->toCollection($event->getSource())
                    );

                    $data[$reorderAction->getOrderField()] = $max + 1;
                }
            }
        );
    }

    public function newOrderFirst(SaveAction $action): void
    {
        $action->afterSave(
            function (AfterSaveEvent $event) {
                $reorderAction = $this->createReorderAction();

                if ($reorderAction->canReorder() && $event->isCreate()) {
                    $reorderAction = $this->createReorderAction();
                    $reorderAction->reorderAllForItem($event->getEntity());

                    $data = &$event->getData();
                    $data[$reorderAction->getOrderField()] = 1;
                }
            }
        );
    }
}

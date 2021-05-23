<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Repository\Actions\ActionsFactory;
use Unicorn\Repository\Actions\SaveAction;
use Windwalker\DI\Attributes\Inject;

/**
 * Trait CrudRepositoryTrait
 */
trait CrudRepositoryTrait
{
    use DatabaseRepositoryTrait;

    #[Inject]
    protected ActionsFactory $actionsFactory;

    public function createSaveAction($actionClass = SaveAction::class): SaveAction
    {
        /** @var SaveAction $action */
        $action = $this->actionsFactory->create($actionClass, $this);

        $this->configureSaveAction($action);

        return $action;
    }

    protected function configureSaveAction(SaveAction $action): void
    {
        //
    }

    public function save(object|array $item, bool $updateNulls = false): object
    {
        return $this->createSaveAction()->save($item, null, $updateNulls);
    }

    public function processDataAndSave(object|array $item, mixed $form = null, array $args = []): object
    {
        return $this->createSaveAction()->processDataAndSave($item, $form, $args);
    }

    /**
     * getItem
     *
     * @param  array        $conditions
     * @param  string|null  $className
     *
     * @return  object
     *
     * @psalm-template T
     * @psalm-param T $className
     * @psalm-return T
     */
    public function getItem(array $conditions = [], ?string $className = null): object
    {
        return $this->getEntityMapper()
            ->findOne($conditions, $className);
    }

    public function delete(array $conditions = []): array
    {
        return $this->getEntityMapper()->deleteWhere($conditions);
    }
}

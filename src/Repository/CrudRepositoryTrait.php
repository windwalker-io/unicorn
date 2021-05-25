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
use Unicorn\Repository\Actions\ReorderAction;
use Unicorn\Repository\Actions\SaveAction;
use Unicorn\Selector\ListSelector;
use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\SelectorQuery;

/**
 * Trait CrudRepositoryTrait
 */
trait CrudRepositoryTrait
{
    use DatabaseRepositoryTrait;
    use ActionsAwareTrait;

    public function getListSelector(): ListSelector
    {
        return $this->createSelector();
    }

    public function createSelector(): ListSelector
    {
        $selector = new ListSelector($this->db, $this->paginationFactory);

        $this->configureSelector($selector->getQuery(), $selector);

        return $selector;
    }

    abstract protected function configureSelector(SelectorQuery $query, ListSelector $selector): void;

    public function createSaveAction(string $actionClass = SaveAction::class): SaveAction
    {
        return $this->actionsFactory->create($actionClass, $this);
    }

    public function save(object|array $item, bool $updateNulls = false): object
    {
        return $this->createSaveAction()->save($item, null, $updateNulls);
    }

    public function processDataAndSave(object|array $item, mixed $form = null, array $args = []): object
    {
        return $this->createSaveAction()->processDataAndSave($item, $form, $args);
    }

    public function createReorderAction(string $actionClass = ReorderAction::class): ReorderAction
    {
        /** @var ReorderAction $action */
        return $this->actionsFactory->create($actionClass, $this);
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

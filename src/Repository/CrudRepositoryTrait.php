<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Repository\Actions\ActionsFactory;
use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\ReorderAction;
use Unicorn\Repository\Actions\SaveAction;
use Unicorn\Selector\ListSelector;
use Windwalker\Core\Router\Exception\RouteNotFoundException;
use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\Exception\NoResultException;
use Windwalker\ORM\SelectorQuery;

/**
 * Trait CrudRepositoryTrait
 */
trait CrudRepositoryTrait
{
    use DatabaseRepositoryTrait;
    use ActionsAwareTrait;
    use StateControlRepositoryTrait;

    public function createSaveAction(string $actionClass = SaveAction::class): SaveAction
    {
        return $this->createAction($actionClass, $this);
    }

    public function save(object|array $item, int $options = 0): object
    {
        return $this->createSaveAction()->save($item, null, $options);
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
     * @return  ?object
     *
     * @psalm-template T
     * @psalm-param T $className
     * @psalm-return T
     */
    public function getItem(mixed $conditions = null, ?string $className = null): ?object
    {
        return $this->getEntityMapper()
            ->findOne($conditions, $className);
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
    public function mustGetItem(mixed $conditions = null, ?string $className = null): object
    {
        try {
            return $this->getEntityMapper()
                ->mustFindOne($conditions, $className);
        } catch (NoResultException $e) {
            throw new RouteNotFoundException($e->getMessage(), $e->getCode(), $e);
        }
    }

    public function delete(array $conditions = []): array
    {
        return $this->getEntityMapper()->deleteWhere($conditions);
    }
}

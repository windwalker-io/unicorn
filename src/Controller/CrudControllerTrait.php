<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Controller;

use App\Entity\Category;
use App\Module\Admin\Category\Form\EditForm;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Core\State\AppState;
use Windwalker\ORM\NestedSetMapper;

/**
 * Trait CrudControllerTrait
 */
trait CrudControllerTrait
{
    public function save(
        AppContext $app,
        AppState $state,
        Navigator $nav
    ): RouteUri {
        try {
            $repository = $app->make($this->getRepositoryClass());

            $item = $app->input('item');

            /** @var Category $item */
            $item = $repository->createSaveAction()
                ->processDataAndSave($item, $this->getEditForm());

            return $nav->self()->id($item->getId());
        } catch (\RuntimeException $e) {
            $item = $app->input('item');
            $state->remember('edit.data', $item);

            return $nav->self()
                ->id($item['id'] ?? null)
                ->withMessage($e->getMessage(), 'warning');
        }
    }

    public function delete(AppContext $app, Navigator $nav): RouteUri
    {
        $repository = $app->make($this->getRepositoryClass());

        $ids = (array) $app->input('id');

        /** @var NestedSetMapper $mapper */
        $mapper = $repository->getEntityMapper();
        $key    = $mapper->getMainKey() ?? 'id';

        try {
            $repository->getDb()->transaction(fn() => $repository->delete([$key => $ids]));
        } catch (\Throwable $e) {
            $app->addMessage($e->getMessage());
        } finally {
            return $nav->back();
        }
    }

    abstract public function getRepositoryClass(): string;

    abstract public function getEditForm(): string;
}

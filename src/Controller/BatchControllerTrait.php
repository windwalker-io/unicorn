<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Repository\ManageRepositoryInterface;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;

/**
 * The BatchControllerTrait class.
 */
trait BatchControllerTrait
{
    public function batch(AppContext $app): mixed
    {
        $task = $app->input('task');

        if ($task) {
            return $app->call([$this, 'batch' . ucfirst($task)]);
        }

        return $app->call([$this, 'batchUpdate']);
    }

    public function batchUpdate(AppContext $app, Navigator $nav): RouteUri
    {
        /** @var ManageRepositoryInterface $repository */
        $repository = $app->make($this->getRepositoryClass());

        $ids = (array) $app->input('id');
        $data = (array) $app->input('batch');

        $repository->createBatchAction()->update($ids, $data);

        return $nav->back();
    }

    public function copy(AppContext $app, Navigator $nav): RouteUri
    {
        /** @var ManageRepositoryInterface $repository */
        $repository = $app->make($this->getRepositoryClass());

        $ids = (array) $app->input('id');
        $data = (array) $app->input('batch');

        $repository->createBatchAction()->copy($ids, $data);

        return $nav->back();
    }

    public function batchMove(AppContext $app, Navigator $nav): RouteUri
    {
        /** @var ManageRepositoryInterface $repository */
        $repository = $app->make($this->getRepositoryClass());

        $ids = (array) $app->input('id');

        $repository->createReorderAction()->move($ids, (int) $app->input('delta'));

        return $nav->back();
    }

    public function batchReorder(AppContext $app, Navigator $nav): RouteUri
    {
        /** @var ManageRepositoryInterface $repository */
        $repository = $app->make($this->getRepositoryClass());

        $orders = (array) $app->input('ordering');

        $repository->createReorderAction()->reorder($orders);

        return $nav->back();
    }
}

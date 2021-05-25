<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Controller;

use App\Module\Admin\Sakura\SakuraRepository;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Core\State\AppState;
use Windwalker\DI\Attributes\Autowire;

/**
 * Trait GridControllerTrait
 */
trait GridControllerTrait
{
    public function save(AppContext $app, AppState $state): mixed
    {
        $method = $app->getRequestMethod();

        $task = match (strtoupper($method)) {
            'PUT' => 'filter',
            'PATCH' => 'batch',
            'DELETE' => 'delete',
        };

        return $app->call([$this, $task], compact('state'));
    }
    
    public function filter(AppState $state, Navigator $nav): RouteUri
    {
        $state->rememberFromRequest('filter');
        $state->rememberFromRequest('search');
        $state->rememberFromRequest('page');
        $state->rememberFromRequest('limit');
        $state->rememberFromRequest('list_ordering');

        return $nav->self();
    }

    public function batch(AppContext $app)
    {
        $task = $app->input('task');

        return $app->call([$this, 'batch' . ucfirst($task)]);
    }

    public function batchMove(AppContext $app, #[Autowire] SakuraRepository $repository, Navigator $nav): RouteUri
    {
        $ids = (array) $app->input('id');

        $repository->createReorderAction()->move($ids, (int) $app->input('delta'));

        return $nav->back();
    }

    public function batchReorder(AppContext $app, #[Autowire] SakuraRepository $repository, Navigator $nav): RouteUri
    {
        $orders = (array) $app->input('ordering');

        $repository->createReorderAction()->reorder($orders);

        return $nav->back();
    }
}

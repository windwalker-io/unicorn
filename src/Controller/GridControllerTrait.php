<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Controller;

use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Core\State\AppState;

/**
 * Trait GridControllerTrait
 */
trait GridControllerTrait
{
    public function filter(AppState $state, Navigator $nav): RouteUri
    {
        $state->rememberFromRequest('filter');
        $state->rememberFromRequest('search');
        $state->rememberFromRequest('page');
        $state->rememberFromRequest('limit');
        $state->rememberFromRequest('list_ordering');

        return $nav->self();
    }
}

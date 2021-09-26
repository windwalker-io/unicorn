<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Repository\DatabaseRepositoryInterface;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\ORM\NestedSetMapper;

/**
 * The NestedSetController class.
 */
class NestedSetController
{
    public function rebuild(AppContext $app, DatabaseRepositoryInterface $repository, Navigator $nav): RouteUri
    {
        /** @var NestedSetMapper $mapper */
        $mapper = $repository->getEntityMapper();

        $mapper->rebuild(1);

        $app->addMessage('Rebuild tree success', 'success');

        return $nav->back();
    }
}

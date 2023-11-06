<?php

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Repository\DatabaseRepositoryInterface;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\ORM\NestedSetMapper;

/**
 * The NestedSetController class.
 */
class NestedSetController
{
    use TranslatorTrait;

    public function rebuild(AppContext $app, DatabaseRepositoryInterface $repository, Navigator $nav): RouteUri
    {
        /** @var NestedSetMapper $mapper */
        $mapper = $repository->getEntityMapper();

        $mapper->rebuild(1);

        $app->addMessage($this->trans('unicorn.message.batch.rebuild.success'), 'success');

        return $nav->back();
    }
}

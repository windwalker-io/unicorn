<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Repository\CrudRepositoryInterface;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Core\View\View;
use Windwalker\Form\FieldDefinitionInterface;
use Windwalker\ORM\NestedSetMapper;

/**
 * The CrudController class.
 */
class CrudController
{
    /**
     * CrudController constructor.
     */
    public function __construct(protected LangService $lang)
    {
        $this->lang = $this->lang->extract('unicorn.message.');
    }

    public function index(string $view, AppContext $app): mixed
    {
        /** @var View $vm */
        $vm = $app->make($view);

        return $vm->render();
    }

    public function save(
        AppContext $app,
        Navigator $nav,
        CrudRepositoryInterface $repository,
        FieldDefinitionInterface $form
    ): RouteUri {
        try {
            $item = $app->input('item');

            /** @var object $item */
            $item = $repository->createSaveAction()
                ->processDataAndSave($item, $form);

            $app->addMessage(
                $this->lang->trans('save.success'),
                'success'
            );

            return $nav->self()->id($item->getId());
        } catch (\RuntimeException $e) {
            $item = $app->input('item');
            $repository->getState()->remember('edit.data', $item);

            throw $e;
        }
    }

    public function delete(
        AppContext $app,
        Navigator $nav,
        CrudRepositoryInterface $repository,
    ): RouteUri {
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
}

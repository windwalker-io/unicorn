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
use Windwalker\Event\EventAwareInterface;
use Windwalker\Event\EventAwareTrait;
use Windwalker\Form\FieldDefinitionInterface;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\BeforeSaveEvent;
use Windwalker\ORM\NestedSetMapper;

/**
 * The CrudController class.
 */
class CrudController implements EventAwareInterface
{
    use EventAwareTrait;

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
            $action = $repository->createSaveAction();

            $action->addEventDealer($this);

            $item = $action->processDataAndSave($item, $form);

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

            $app->addMessage(
                $this->lang->trans("batch.delete.success", count($ids)),
                'success'
            );

            return $nav->back();
        } catch (\Throwable $e) {
            $app->addMessage($e->getMessage());

            throw $e;
        }
    }

    public function beforeSave(callable $handler): static
    {
        $this->on(BeforeSaveEvent::class, $handler);

        return $this;
    }

    public function afterSave(callable $handler): static
    {
        $this->on(AfterSaveEvent::class, $handler);

        return $this;
    }
}

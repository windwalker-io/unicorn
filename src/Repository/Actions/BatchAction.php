<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Unicorn\Repository\Event\AfterBatchItemEvent;
use Unicorn\Repository\Event\BeforeBatchItemEvent;
use Windwalker\Core\Form\Exception\ValidateFailException;
use Windwalker\Core\Language\LangService;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Utilities\Exception\MultiMessagesExceptionTrait;
use Windwalker\Utilities\Symbol;

/**
 * The BatchAction class.
 */
class BatchAction extends AbstractDatabaseAction
{
    use FormAwareActionTrait;

    protected ?Symbol $emptySymbol = null;

    #[Inject]
    protected LangService $lang;

    /**
     * update
     *
     * @param  array       $ids
     * @param  array       $data
     * @param  mixed|null  $form
     * @param  array       $args
     *
     * @return  array<object>
     */
    public function update(array $ids, array $data, mixed $form = null, array $args = []): array
    {
        if ($form) {
            $data = $this->filterBy(['batch' => $data], $form, $args);
            $data = $data['batch'] ?? [];
        }

        $key = $this->getEntityMapper()->getMainKey();
        $data = $this->cleanData($data);
        $mapper = $this->getEntityMapper();
        $items = [];

        foreach ($ids as $id) {
            $item = $data;

            if ($data === []) {
                throw new ValidateFailException(
                    $this->lang->trans('unicorn.message.batch.data.empty')
                );
            }

            $item[$key] = $id;

            $event = $this->emit(
                BeforeBatchItemEvent::class,
                [
                    'id' => $id,
                    'data' => $item,
                    'task' => 'update',
                    'action' => $this,
                    'orm' => $mapper->getORM()
                ]
            );

            $mapper->updateOne($oldData = $event->getData());

            $event = $this->emit(
                AfterBatchItemEvent::class,
                [
                    'id' => $id,
                    'data' => $item,
                    'task' => 'update',
                    'action' => $this,
                    'orm' => $mapper->getORM()
                ]
            );

            $items[] = $event->getData();
        }

        return $items;
    }

    public function copy(array $ids, array $data, mixed $form = null, array $args = []): array
    {
        if ($form) {
            $data = $this->filterBy(['batch' => $data], $form, $args);
            $data = $data['batch'] ?? [];
        }

        $key = $this->getEntityMapper()->getMainKey();
        $data = $this->cleanData($data);
        $mapper = $this->getEntityMapper();
        $items = [];

        foreach ($ids as $id) {
            if ($data === []) {
                // throw new ValidateFailException(
                //     $this->lang->trans('unicorn.message.batch.data.empty')
                // );
            }

            $event = $this->emit(
                BeforeBatchItemEvent::class,
                [
                    'id' => $id,
                    'data' => $data,
                    'task' => 'copy',
                    'action' => $this,
                    'orm' => $mapper->getORM()
                ]
            );

            $data = $mapper->copy(
                [$key => $event->getId()],
                fn(array $item) => array_merge($item, $event->getData())
            );

            $event = $this->emit(
                AfterBatchItemEvent::class,
                [
                    'id' => $id,
                    'data' => $data,
                    'task' => 'copy',
                    'action' => $this,
                    'orm' => $mapper->getORM()
                ]
            );

            $items[] = $event->getData();
        }

        return $items;
    }

    public function cleanData(array $data): array
    {
        // Remove empty data
        foreach ($data as $k => $value) {
            if ($this->getEmptySymbol()->is($value)) {
                $data[$k] = '';
            } elseif ($value === '\\' . $this->getEmptySymbol()->getValue()) {
                $data[$k] = $this->getEmptySymbol()->getValue();
            } elseif ((string) $value === '') {
                unset($data[$k]);
            }
        }

        return $data;
    }

    /**
     * @return Symbol
     */
    public function getEmptySymbol(): Symbol
    {
        return $this->emptySymbol ??= Symbol::empty();
    }

    /**
     * @param  Symbol|null  $emptySymbol
     *
     * @return  static  Return self to support chaining.
     */
    public function setEmptySymbol(?Symbol $emptySymbol): static
    {
        $this->emptySymbol = $emptySymbol;

        return $this;
    }
}

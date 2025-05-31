<?php

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Unicorn\Repository\Event\AfterBatchEvent;
use Unicorn\Repository\Event\AfterBatchItemEvent;
use Unicorn\Repository\Event\BeforeBatchEvent;
use Unicorn\Repository\Event\BeforeBatchItemEvent;
use Windwalker\Core\Form\Exception\ValidateFailException;
use Windwalker\Utilities\Symbol;

/**
 * The BatchAction class.
 */
class BatchAction extends AbstractDatabaseAction
{
    use FormAwareActionTrait;

    protected ?Symbol $emptySymbol = null;

    /**
     * update
     *
     * @param  array  $ids
     * @param  array  $data
     * @param  mixed|null  $form
     * @param  array  $args
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

        $event = $this->emit(
            new BeforeBatchEvent(
                orm: $mapper->getORM(),
                action: $this,
                ids: $ids,
                task: 'update',
                data: $data
            )
        );

        $ids = $event->ids;
        $data = $event->data;

        foreach ($ids as $id) {
            $item = $data;

            if ($data === []) {
                throw new ValidateFailException(
                    $this->trans('unicorn.message.batch.data.empty')
                );
            }

            $item[$key] = $id;

            $event = $this->emit(
                new BeforeBatchItemEvent(
                    orm: $mapper->getORM(),
                    action: $this,
                    id: $id,
                    task: 'update',
                    data: $item
                )
            );

            $mapper->updateOne($event->data);

            $event = $this->emit(
                new BeforeBatchEvent(
                    orm: $mapper->getORM(),
                    action: $this,
                    ids: $ids,
                    task: 'update',
                    data: $event->data
                )
            );

            $items[] = $event->data;
        }

        $event = $this->emit(
            new AfterBatchEvent(
                orm: $mapper->getORM(),
                action: $this,
                ids: $ids,
                task: 'update',
                data: $data,
                items: $items
            )
        );

        return $event->items;
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

        $event = $this->emit(
            new BeforeBatchEvent(
                orm: $mapper->getORM(),
                action: $this,
                ids: $ids,
                task: 'copy',
                data: $data
            )
        );

        $ids = $event->ids;
        $data = $event->data;

        foreach ($ids as $id) {
            if ($data === []) {
                // throw new ValidateFailException(
                //     $this->trans('unicorn.message.batch.data.empty')
                // );
            }

            $event = $this->emit(
                new BeforeBatchItemEvent(
                    orm: $mapper->getORM(),
                    action: $this,
                    id: $id,
                    task: 'copy',
                    data: $data
                )
            );

            $result = $mapper->copy(
                [$key => $event->id],
                fn(array $item) => array_merge($item, $event->data)
            );

            $event = $this->emit(
                new AfterBatchItemEvent(
                    orm: $mapper->getORM(),
                    action: $this,
                    id: $id,
                    task: 'copy',
                    data: $result
                )
            );

            $items[] = $event->data;
        }

        $event = $this->emit(
            new AfterBatchEvent(
                orm: $mapper->getORM(),
                action: $this,
                ids: $ids,
                task: 'copy',
                data: $event->data,
                items: $items
            )
        );

        return $event->items;
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

    public function beforeBatch(callable $listener): static
    {
        return $this->on(BeforeBatchEvent::class, $listener);
    }

    public function afterBatch(callable $listener): static
    {
        return $this->on(AfterBatchEvent::class, $listener);
    }

    public function beforeBatchItem(callable $listener): static
    {
        return $this->on(BeforeBatchItemEvent::class, $listener);
    }

    public function afterBatchItem(callable $listener): static
    {
        return $this->on(AfterBatchItemEvent::class, $listener);
    }
}

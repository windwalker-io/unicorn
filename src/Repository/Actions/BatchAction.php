<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

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
            $data[$key] = $id;
            $items[] = $mapper->updateOne($data);
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
            $items[] = $mapper->copy(
                [$key => $id],
                fn(array $item) => array_merge($item, $data)
            );
        }

        return $items;
    }

    public function cleanData(array $data): array
    {
        // Remove empty data
        foreach ($data as $k => $value) {
            if ((string) $value === '') {
                unset($data[$k]);
            } elseif ($this->getEmptySymbol()->is($value)) {
                $data[$k] = '';
            } elseif ($value === '\\' . $this->getEmptySymbol()->getValue()) {
                $data[$k] = $this->getEmptySymbol()->getValue();
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

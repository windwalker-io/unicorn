<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Core\Manager\DatabaseManager;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Query\Query;

/**
 * Trait DatabaseAwareTrait
 */
trait DatabaseAwareTrait
{
    protected ?string $connection = null;

    protected ?string $table = null;

    protected ?Query $query = null;

    #[Inject]
    protected DatabaseManager $dbManager;

    public function getDb(): DatabaseAdapter
    {
        $connection = $this->getConnection();

        if ($connection instanceof DatabaseAdapter) {
            return $connection;
        }

        return $this->dbManager->get($connection);
    }

    public function configureQuery(callable $handler): static
    {
        $query = $handler($this->getQuery());

        if ($query !== null) {
            $this->setQuery($query);
        }

        return $this;
    }

    public function compileQuery(): Query
    {
        $this->prepareQuery($query = $this->getQuery());

        return $query;
    }

    public function createQuery(): Query
    {
        $query = $this->getDb()->orm()->select();

        return $query->from($this->getTable());
    }

    /**
     * @return Query
     */
    public function getQuery(): Query
    {
        return $this->query ??= $this->createQuery();
    }

    /**
     * @param  Query|null  $query
     *
     * @return  static  Return self to support chaining.
     */
    public function setQuery(?Query $query): static
    {
        $this->query = $query;

        return $this;
    }

    public function getItems(): iterable
    {
        $this->prepareQuery($query = $this->getQuery());

        return $query;
    }

    abstract protected function prepareQuery(Query $query): void;

    /**
     * @return string|null
     */
    public function getTable(): ?string
    {
        return $this->table;
    }

    /**
     * @param  string|null  $table
     *
     * @return  static  Return self to support chaining.
     */
    public function table(?string $table): static
    {
        $this->table = $table;

        return $this;
    }
}

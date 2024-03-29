<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Core\Manager\DatabaseManager;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\SelectorQuery;
use Windwalker\Query\Query;

/**
 * Trait DatabaseAwareTrait
 */
trait DatabaseAwareTrait
{
    protected ?string $connection = null;

    protected ?string $table = null;

    protected ?Query $query = null;

    protected string|false $autoSelections = '.';

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
        $query = $handler($this->getQuery(), $this);

        if ($query !== null) {
            $this->setQuery($query);
        }

        return $this;
    }

    public function compileQuery(): SelectorQuery
    {
        $this->prepareQuery($query = clone $this->getQuery());

        if ($this->getAutoSelections()) {
            $query->autoSelections($this->getAutoSelections());
        }

        return $query;
    }

    public function createQuery(): SelectorQuery
    {
        $query = $this->getDb()->orm()->select();

        $table = $this->getTable();

        if (!$table) {
            throw new \LogicException(
                sprintf(
                    'No table provided for class: %s',
                    static::class
                )
            );
        }

        return $query->from($table);
    }

    /**
     * @return SelectorQuery
     */
    public function getQuery(): SelectorQuery
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
        return $this->compileQuery();
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

    /**
     * @return false|string
     */
    public function getAutoSelections(): bool|string
    {
        return $this->autoSelections;
    }

    /**
     * @param  false|string  $autoSelection
     *
     * @return  static  Return self to support chaining.
     */
    public function autoSelection(bool|string $autoSelection): static
    {
        $this->autoSelections = $autoSelection;

        return $this;
    }
}

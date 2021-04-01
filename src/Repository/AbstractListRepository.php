<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Traversable;
use Unicorn\Repository\Filter\FilterHelper;
use Unicorn\Repository\Filter\SearchHelper;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Data\Collection;
use Windwalker\Query\Query;
use Windwalker\Session\Handler\FilesystemHandler;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

/**
 * The ListRepository class.
 */
abstract class AbstractListRepository implements ListRepositoryInterface, DatabaseRepositoryInterface
{
    use InstanceCacheTrait;

    use DatabaseRepositoryTrait;

    protected ?Query $query = null;

    protected int $page = 1;

    protected int $limit = 1;

    protected ?FilterHelper $filterHelper = null;

    protected ?SearchHelper $searchHelper = null;

    /**
     * createQuery
     *
     * @return  Query
     *
     * @throws \ReflectionException
     */
    public function createQuery(): Query
    {
        return $this->db->orm()->mapper(static::getEntityClass())->createSelectorQuery();
    }

    /**
     * Retrieve an external iterator
     * @link https://php.net/manual/en/iteratoraggregate.getiterator.php
     *
     * @param  string|null  $class
     * @param  array        $args
     *
     * @return Traversable An instance of an object implementing <b>Iterator</b> or
     * <b>Traversable</b>
     */
    public function getIterator(?string $class = null, array $args = []): \Traversable
    {
        return $this->getQuery()->getIterator(
            $class ?? static::getEntityClass(),
            $args
        );
    }

    public function getQuery(): Query
    {
        return $this->query ??= $this->createQuery();
    }

    public function all(?string $class = null, array $args = []): Collection
    {
        return $this->getQuery()->all($class, $args);
    }

    public function get(?string $class = null, array $args = []): object
    {
        return $this->getQuery()->get($class, $args);
    }

    public function page(int $page): static
    {
        $this->page = $page;

        return $this;
    }

    public function limit(int $limit): static
    {
        $this->limit = $limit;

        return $this;
    }

    public function count(): int
    {
        return $this->cacheStorage['count'] ??= $this->getQuery()->count();
    }

    public function getOffset(): int
    {
        return ($this->page = 1) * $this->limit;
    }

    public function getPage(): int
    {
        return $this->page;
    }

    /**
     * addFilter
     *
     * @param  string  $key
     * @param  mixed   $value
     *
     * @return  static
     */
    public function addFilter(string $key, mixed $value): static
    {
    }

    /**
     * addSearch
     *
     * @param  string  $key
     * @param  mixed   $value
     *
     * @return  static
     */
    public function addSearch(string $key, mixed $value): static
    {
    }

    /**
     * getPagination
     *
     * @param  int|null  $total
     *
     * @return Pagination
     */
    public function getPagination(?int $total = null): Pagination
    {
    }

    /**
     * @return FilterHelper
     */
    public function getFilterHelper(): FilterHelper
    {
        return $this->filterHelper ??= new FilterHelper();
    }

    /**
     * @param  FilterHelper|null  $filterHelper
     *
     * @return  static  Return self to support chaining.
     */
    public function setFilterHelper(?FilterHelper $filterHelper): static
    {
        $this->filterHelper = $filterHelper;

        return $this;
    }

    /**
     * @return SearchHelper
     */
    public function getSearchHelper(): SearchHelper
    {
        return $this->searchHelper ??= new SearchHelper();
    }

    /**
     * @param  SearchHelper|null  $searchHelper
     *
     * @return  static  Return self to support chaining.
     */
    public function setSearchHelper(?SearchHelper $searchHelper): static
    {
        $this->searchHelper = $searchHelper;

        return $this;
    }
}

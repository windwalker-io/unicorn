<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Selector;

use Unicorn\Repository\DatabaseRepositoryTrait;
use Unicorn\Selector\Filter\FilterHelper;
use Unicorn\Selector\Filter\SearchHelper;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Data\Collection;
use Windwalker\ORM\SelectorQuery;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

/**
 * The AbstractSelector class.
 */
abstract class AbstractListSelector
{
    use InstanceCacheTrait;

    use DatabaseRepositoryTrait;

    protected ?SelectorQuery $query = null;

    protected int $page = 1;

    protected int $limit = 1;

    protected array $filters = [];

    protected array $searches = [];

    protected ?FilterHelper $filterHelper = null;

    protected ?SearchHelper $searchHelper = null;

    abstract public static function getEntityClass(): string;

    /**
     * createQuery
     *
     * @return  SelectorQuery
     *
     * @throws \ReflectionException
     */
    public function createQuery(): SelectorQuery
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
     * @return \Traversable An instance of an object implementing <b>Iterator</b> or
     * <b>Traversable</b>
     */
    public function getIterator(?string $class = null, array $args = []): \Traversable
    {
        return $this->getQuery()->getIterator(
            $class ?? static::getEntityClass(),
            $args
        );
    }

    public function getQuery(): SelectorQuery
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

    public function addFilterHandler(string $key, callable $handler): static
    {
        $this->getFilterHelper()->addHandler($key, $handler);

        return $this;
    }

    public function addSearchHandler(string $key, callable $handler): static
    {
        $this->getSearchHelper()->addHandler($key, $handler);

        return $this;
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
        $this->filters[$key] = $value;

        return $this;
    }

    /**
     * hasFilter
     *
     * @param string $key
     *
     * @return  bool
     *
     * @since   1.6.7
     */
    public function hasFilter(string $key): bool
    {
        $v = $this->filters[$key];

        if (is_array($v)) {
            return $v !== [];
        }

        if (is_object($v)) {
            return true;
        }

        return (string) $v !== '';
    }

    /**
     * getFilter
     *
     * @param string $key
     *
     * @return  mixed
     *
     * @since  1.7.7
     */
    public function getFilter(string $key): mixed
    {
        return $this->filters[$key] ?? null;
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
        $this->searches[$key] = $value;

        return $this;
    }

    /**
     * hasSearch
     *
     * @param string $key
     *
     * @return  bool
     *
     * @since  1.6.7
     */
    public function hasSearch(string $key): bool
    {
        return (string) ($this->searches[$key] ?? '') !== '';
    }

    /**
     * getSearch
     *
     * @param string $key
     *
     * @return  mixed
     *
     * @since  1.7.7
     */
    public function getSearch(string $key): mixed
    {
        return $this->searches[$key] ?? null;
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

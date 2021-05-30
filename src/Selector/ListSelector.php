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
use Unicorn\Selector\Event\AfterCompileQueryEvent;
use Unicorn\Selector\Event\BeforeCompileQueryEvent;
use Unicorn\Selector\Event\ConfigureQueryEvent;
use Unicorn\Selector\Filter\FilterHelper;
use Unicorn\Selector\Filter\SearchHelper;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Core\Pagination\PaginationFactory;
use Windwalker\Data\Collection;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\Event\EventAwareInterface;
use Windwalker\Event\EventAwareTrait;
use Windwalker\ORM\SelectorQuery;
use Windwalker\Query\Query;
use Windwalker\Utilities\Arr;
use Windwalker\Utilities\Cache\InstanceCacheTrait;
use Windwalker\Utilities\Classes\FlowControlTrait;

use function Windwalker\raw;

/**
 * The AbstractSelector class.
 */
class ListSelector implements EventAwareInterface, \IteratorAggregate
{
    use EventAwareTrait;
    use InstanceCacheTrait;
    use FlowControlTrait;

    protected ?SelectorQuery $query = null;

    protected int $page = 1;

    protected ?int $limit = null;

    protected ?array $allowFields = null;
    
    protected array $customAllowFields = [];

    protected array $filters = [];

    protected array $searches = [];

    protected array $fieldAlias = [];

    protected ?FilterHelper $filterHelper = null;

    protected ?SearchHelper $searchHelper = null;

    /**
     * ListSelector constructor.
     *
     * @param  DatabaseAdapter    $db
     * @param  PaginationFactory  $paginationFactory
     */
    public function __construct(protected DatabaseAdapter $db, protected PaginationFactory $paginationFactory)
    {
    }

    /**
     * createQuery
     *
     * @return  SelectorQuery
     *
     * @throws \ReflectionException
     */
    public function createQuery(): SelectorQuery
    {
        $query = $this->db->orm()->select();

        // $this->configureQuery($query);

        $selector = $this;

        $this->emit(
            ConfigureQueryEvent::class,
            compact('query', 'selector')
        );

        return $query;
    }

    public function modifyQuery(callable $callback): static
    {
        $callback($this->getQuery());

        return $this;
    }

    // abstract protected function configureQuery(SelectorQuery $query): void;

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
        return $this->compileQuery()->getIterator(
            $class ?? Collection::class,
            $args
        );
    }

    public function getQuery(): SelectorQuery
    {
        return $this->query ??= $this->createQuery();
    }

    public function compileQuery(): SelectorQuery
    {
        $query = clone $this->getQuery();
        $selector = $this;

        // $this->beforeCompileQuery($query);

        $event = $this->emit(
            BeforeCompileQueryEvent::class,
            compact('query', 'selector')
        );
        
        $query = $this->processFilters($event->getQuery());
        $query = $this->processSearches($query);

        if ($this->limit) {
            $query->limit($this->limit);
            $query->offset($this->getOffset());
        }

        $query->groupByJoins('.');

        // $this->afterCompileQuery($query);

        $event = $this->emit(
            AfterCompileQueryEvent::class,
            compact('query', 'selector')
        );

        return $event->getQuery();
    }

    // abstract protected function beforeCompileQuery(SelectorQuery $query): void;
    //
    // abstract protected function afterCompileQuery(SelectorQuery $query): void;

    public function all(?string $class = null, array $args = []): Collection
    {
        return $this->compileQuery()->all($class, $args);
    }

    public function get(?string $class = null, array $args = []): object
    {
        return $this->compileQuery()->get($class, $args);
    }

    public function page(int|string $page): static
    {
        if ($page < 1) {
            $page = 1;
        }

        $this->page = $page;

        return $this;
    }

    public function limit(int|string|null $limit): static
    {
        if ($limit !== null) {
            $limit = (int) $limit;
        }

        $this->limit = $limit;

        return $this;
    }

    public function count(): int
    {
        return $this->cacheStorage['count'] ??= $this->compileQuery()->count();
    }

    public function ordering(mixed $order, ?string $dir = null): static
    {
        if (is_string($order)) {
            $order = Arr::explodeAndClear(',', $order);
        }

        foreach ($order as $i => $orderItem) {
            if (is_string($orderItem)) {
                $orderItem = Arr::explodeAndClear(' ', $orderItem);

                if ($dir !== null) {
                    $orderItem[1] = $dir;
                }

                $orderItem[1] ??= 'ASC';
                $orderItem[1] = strtoupper($orderItem[1]);

                if (str_ends_with($orderItem[1], '()')) {
                    $orderItem[1] = raw($orderItem[1]);
                }

                $order[$i] = $orderItem;
            }
        }

        $this->getQuery()->order($order);

        return $this;
    }

    public function getOrdering(): ?string
    {
        $order = $this->getQuery()->getOrder();

        if (!$order) {
            return null;
        }

        return (string) $order;
    }

    public function getOffset(): int
    {
        return ($this->page - 1) * $this->limit;
    }

    public function getPage(): int
    {
        return $this->page;
    }

    public function getAllowFields(): array
    {
        return $this->once('allow.fields', function () {
            $allowFields = $this->allowFields ??= $this->getDatabaseAllowFields();

            return array_merge(
                $allowFields,
                $this->customAllowFields
            );
        });
    }

    protected function getDatabaseAllowFields(): array
    {
        $query = clone $this->getQuery();
        $query->autoSelections('.', $columns);

        return $columns;
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

    protected function processFilters(SelectorQuery $query): SelectorQuery
    {
        $filters = [];

        foreach ($this->filters as $field => $value) {
            $field = $this->resolveFieldAlias((string) $field);

            if ($this->isFieldAllow($field)) {
                $filters[$field] = $value;
            }
        }

        $this->getFilterHelper()->process($query, $filters);

        return $query;
    }

    protected function processSearches(SelectorQuery $query): SelectorQuery
    {
        $searches = [];

        foreach ($this->searches as $field => $value) {
            $field = $this->resolveFieldAlias($field);

            if ($this->isFieldAllow($field)) {
                $searches[$field] = $value;
            }
        }

        $this->getSearchHelper()->process($query, $searches);

        return $query;
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
     * @param  array  $filters
     *
     * @return  static  Return self to support chaining.
     */
    public function setFilters(array $filters): static
    {
        $this->filters = $filters;

        return $this;
    }

    public function addFilters(mixed ...$filters): static
    {
        $filters = Arr::collapse($filters);

        $this->filters = array_merge($this->filters, $filters);

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
     * @param  array  $searches
     *
     * @return  static  Return self to support chaining.
     */
    public function setSearches(array $searches): static
    {
        $this->searches = $searches;

        return $this;
    }

    public function addSearches(mixed ...$searches): static
    {
        $searches = Arr::collapse($searches);

        $this->searches = array_merge($this->searches, $searches);

        return $this;
    }

    public function searchFor(?string $q, array $fields = []): static
    {
        if ((string) $q === '') {
            return $this;
        }

        foreach ($fields as $field) {
            $this->searches[$field] = $q;
        }

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
     * @param  int|callable|null  $total
     * @param  int|null           $neighbours
     *
     * @return Pagination
     */
    public function getPagination(int|callable|null $total = null, ?int $neighbours = null): Pagination
    {
        return $this->paginationFactory->create(
            $this->getPage(),
            $this->limit,
            $neighbours
        )
            ->total($total ?? fn () => $this->count());
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

    /**
     * @param  array  $allowFields
     *
     * @return  static  Return self to support chaining.
     */
    public function setAllowFields(array $allowFields): static
    {
        $this->customAllowFields = $allowFields;

        return $this;
    }

    public function isFieldAllow(string $field): bool
    {
        return in_array($field, $this->getAllowFields(), true);
    }

    public function resolveFieldAlias(string $field): string
    {
        while (isset($this->fieldAlias[$field])) {
            $field = $this->fieldAlias[$field];
        }

        return $field;
    }

    /**
     * @return array
     */
    public function getFieldAlias(): array
    {
        return $this->fieldAlias;
    }

    /**
     * @param  array  $fieldAlias
     *
     * @return  static  Return self to support chaining.
     */
    public function setFieldAlias(array $fieldAlias): static
    {
        $this->fieldAlias = $fieldAlias;

        return $this;
    }

    public function fieldAlias(string $alias, string $field): static
    {
        $this->fieldAlias[$alias] = $field;

        return $this;
    }
}

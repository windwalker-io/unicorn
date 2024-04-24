<?php

declare(strict_types=1);

namespace Unicorn\Selector;

use Unicorn\Selector\Event\AfterCompileQueryEvent;
use Unicorn\Selector\Event\BeforeCompileQueryEvent;
use Unicorn\Selector\Event\ConfigureQueryEvent;
use Unicorn\Selector\Filter\FilterHelper;
use Unicorn\Selector\Filter\OrderingHelper;
use Unicorn\Selector\Filter\SearchHelper;
use Windwalker\Core\Database\QueryProxyTrait;
use Windwalker\Core\Event\CoreEventAwareTrait;
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
use Windwalker\Utilities\Options\OptionAccessTrait;
use Windwalker\Utilities\Wrapper\RawWrapper;

use Windwalker\Utilities\Wrapper\WrapperInterface;

use function Windwalker\raw;
use function Windwalker\value;

/**
 * The AbstractSelector class.
 */
class ListSelector implements EventAwareInterface, \IteratorAggregate, \Countable
{
    use OptionAccessTrait;
    use CoreEventAwareTrait;
    use InstanceCacheTrait;
    use FlowControlTrait;
    use QueryProxyTrait;

    public static int $globalDefaultLimit = 0;

    protected ?SelectorQuery $query = null;

    protected ?int $offset = null;

    protected ?int $page = null;

    protected ?int $limit = null;

    protected array|string $searchText = '';

    protected ?string $defaultOrdering = null;

    protected ?int $defaultLimit = null;

    protected array $searchFields = [];

    protected ?array $allowFields = null;

    protected array $customAllowFields = [];

    protected array $filters = [];

    protected array $searches = [];

    protected array $fieldAliases = [];

    protected ?string $defaultItemClass = null;

    protected ?\Closure $countCallback = null;

    protected ?FilterHelper $filterHelper = null;

    protected ?SearchHelper $searchHelper = null;

    protected ?OrderingHelper $orderingHelper = null;

    /**
     * ListSelector constructor.
     *
     * @param  DatabaseAdapter     $db
     * @param  ?PaginationFactory  $paginationFactory
     */
    public function __construct(protected DatabaseAdapter $db, protected ?PaginationFactory $paginationFactory = null)
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
            $class ?? $this->getDefaultItemClass(),
            $args
        );
    }

    public function getQuery(): SelectorQuery
    {
        return $this->query ??= $this->createQuery();
    }

    public function compileQuery(bool $autoSelection = true): SelectorQuery
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

        // ordering
        $order = $query->getOrder();

        if ($order === null && $this->defaultOrdering) {
            $query = $this->handleOrdering($query, $this->defaultOrdering);
        }

        if ($autoSelection) {
            if (!$this->isDisableSelectGroup()) {
                $query->groupByJoins('.');
            } else {
                $query->autoSelections('_');
            }
        }

        if ($limit = $this->getLimit()) {
            $query->limit($limit);
            // Pre-count to cache the total value.
            $this->count($query);
            $query->offset($this->getOffset());
        }

        if ($this->defaultItemClass) {
            $query->setDefaultItemClass($this->defaultItemClass);
        }

        // $this->afterCompileQuery($query);

        $event = $this->emit(
            AfterCompileQueryEvent::class,
            compact('query', 'selector')
        );

        return $event->getQuery();
    }

    public function all(?string $class = null, array $args = []): Collection
    {
        return $this->compileQuery()->all($class, $args);
    }

    public function get(?string $class = null, array $args = []): ?object
    {
        return $this->compileQuery()->get($class, $args);
    }

    public function mustGet(?string $class = null, array $args = []): object
    {
        return $this->compileQuery()->mustGet($class, $args);
    }

    public function page(int|string|null $page): static
    {
        if ($page === null) {
            $this->page = $page;
            return $this;
        }

        if ($page < 1) {
            $page = 1;
        }

        $this->page = (int) $page;

        return $this;
    }

    public function offset(int|string|null $offset): static
    {
        if ($offset === null) {
            $this->offset = $offset;
            return $this;
        }

        $this->offset = (int) $offset;

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

    public function setCountCallback(?\Closure $callback): static
    {
        $this->countCallback = $callback;

        return $this;
    }

    public function getCountCallback(): ?\Closure
    {
        return $this->countCallback;
    }

    public function count(Query $query = null): int
    {
        if (array_key_exists('count', $this->cacheStorage)) {
            return (int) $this->cacheStorage['count'];
        }

        // Pre-count to store cache, otherwise will cause infinity loop.
        $query ??= $this->compileQuery(false);

        // compileQuery may run count() priority, this line prevents run again.
        if (array_key_exists('count', $this->cacheStorage)) {
            return (int) $this->cacheStorage['count'];
        }

        if ($this->countCallback) {
            $count = (int) ($this->countCallback)(clone $query);
        } else {
            $count = $query->count();
        }

        return $this->cacheStorage['count'] = $count;
    }

    /**
     * ordering
     *
     * @param  array|string|RawWrapper  $order
     * @param  string|null              $dir
     *
     * @return  $this
     */
    public function ordering(mixed $order, ?string $dir = null): static
    {
        if ($order === null) {
            return $this;
        }

        $this->handleOrdering($this->getQuery(), $order, $dir);

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
        return $this->once(
            'offset',
            function () {
                $start = 0;

                if ($this->offset !== null) {
                    $start = $this->offset;
                } elseif ($this->page !== null && $this->getLimit()) {
                    $start = ($this->page - 1) * $this->getLimit();
                }

                if ($start < 0) {
                    $start = 0;
                }

                if ($this->getOption('page_fix') ?? true) {
                    $limit = $this->getLimit();
                    $total = $this->count();

                    if ($total && $start > $total - $limit) {
                        $page  = (int) ceil($total / $limit);
                        $start = max(0, ($page - 1) * $limit);

                        $this->page($page);
                    }
                }

                return $start;
            }
        );
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

        $this->addAllowFields($key);

        return $this;
    }

    public function addSearchHandler(string $key, callable $handler): static
    {
        $this->getSearchHelper()->addHandler($key, $handler);

        $this->addAllowFields($key);

        return $this;
    }

    public function addOrderingHandler(string $key, callable $handler): static
    {
        $this->getOrderingHelper()->addHandler($key, $handler);

        $this->addAllowFields($key);

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

        if ($this->searchText) {
            foreach ($this->searchFields as $field) {
                foreach ((array) $this->searchText as $text) {
                    if ((trim($text) !== '') && $this->isFieldAllow($field)) {
                        $searches[$field] = $text;
                    }
                }
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
    public function setFilters(array $filters, bool $merge = false): static
    {
        if ($merge) {
            $this->filters = array_merge($this->filters, $filters);
        } else {
            $this->filters = $filters;
        }

        return $this;
    }

    public function addFilters(mixed ...$filters): static
    {
        $this->setFilters($filters, true);

        return $this;
    }

    /**
     * hasFilter
     *
     * @param  string  $key
     *
     * @return  bool
     *
     * @since   1.6.7
     */
    public function hasFilter(string $key): bool
    {
        $v = $this->filters[$key] ?? null;

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
     * @param  string  $key
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
     * @param  bool   $merge
     *
     * @return  static  Return self to support chaining.
     */
    public function setSearches(array $searches, bool $merge = false): static
    {
        if ($merge) {
            $this->searches = array_merge($this->searches, $searches);
        } else {
            $this->searches = $searches;
        }

        return $this;
    }

    public function addSearches(mixed ...$searches): static
    {
        $this->setSearches($searches, true);

        return $this;
    }

    public function searchTextFor(string|array $q, array $fields = [], bool $breakWords = false): static
    {
        if (is_string($q) && $breakWords) {
            $q = Arr::explodeAndClear(' ', $q);
        }

        if (is_string($q)) {
            $this->searchText = trim($q);
        } else {
            $this->searchText = array_map('trim', $q);
        }

        $this->setSearchFields($fields);

        return $this;
    }

    public function fuzzySearchTextFor(string $q, array $fields = []): static
    {
        return $this->searchTextFor($q, $fields, true);
    }

    /**
     * hasSearch
     *
     * @param  string  $key
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
     * @param  string  $key
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
        $limit = (int) $this->getLimit();

        if ($limit <= 0) {
            $page = 1;
        } else {
            $page = (int) ceil($this->getOffset() / $limit) + 1;
        }

        return $this->paginationFactory->create(
            $page,
            $limit,
            $neighbours
        )
            ->total($total ?? fn() => $this->count());
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

    public function getOrderingHelper(): OrderingHelper
    {
        return $this->orderingHelper ??= new OrderingHelper();
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
     * @param  SearchHelper|null  $orderingHelper
     *
     * @return  static  Return self to support chaining.
     */
    public function setOrderingHelper(?OrderingHelper $orderingHelper): static
    {
        $this->orderingHelper = $orderingHelper;

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

    public function addAllowFields(string ...$fields): static
    {
        foreach ($fields as $field) {
            $this->customAllowFields[] = $field;
        }

        return $this;
    }

    public function isFieldAllow(string $field): bool
    {
        return in_array($field, $this->getAllowFields(), true);
    }

    public function resolveFieldAlias(string $field): string
    {
        while (isset($this->fieldAliases[$field])) {
            $field = $this->fieldAliases[$field] ?? null;

            if ($field === null) {
                break;
            }
        }

        return $field;
    }

    public function resolveField(string $field): ?string
    {
        if (!$this->isFieldAllow($field)) {
            return null;
        }

        return $this->resolveFieldAlias($field);
    }

    /**
     * @return array
     */
    public function getFieldAliases(): array
    {
        return $this->fieldAliases;
    }

    /**
     * @param  array  $fieldAliases
     *
     * @return  static  Return self to support chaining.
     */
    public function setFieldAliases(array $fieldAliases): static
    {
        $this->fieldAliases = $fieldAliases;

        return $this;
    }

    public function fieldAlias(string $alias, string $field): static
    {
        $this->fieldAliases[$alias] = $field;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getDefaultOrdering(): ?string
    {
        return $this->defaultOrdering;
    }

    /**
     * @param  string|null  $defaultOrdering
     *
     * @return  static  Return self to support chaining.
     */
    public function defaultOrdering(?string $defaultOrdering): static
    {
        $this->defaultOrdering = $defaultOrdering;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getDefaultLimit(): ?int
    {
        return $this->defaultLimit ?? static::$globalDefaultLimit;
    }

    /**
     * @param  int|null  $defaultLimit
     *
     * @return  static  Return self to support chaining.
     */
    public function defaultLimit(?int $defaultLimit): static
    {
        $this->defaultLimit = $defaultLimit;

        return $this;
    }

    /**
     * @return array
     */
    public function getSearchFields(): array
    {
        return $this->searchFields;
    }

    /**
     * @param  array  $searchFields
     *
     * @return  static  Return self to support chaining.
     */
    public function setSearchFields(array $searchFields): static
    {
        $this->searchFields = $searchFields;

        return $this;
    }

    protected function handleOrdering(Query $query, mixed $order, ?string $dir = null): Query
    {
        if (is_string($order)) {
            $order = Arr::explodeAndClear(',', $order);
        }

        if ($order instanceof RawWrapper) {
            $order = [$order];
        }

        $helper = $this->getOrderingHelper();
        $orderData = [];

        foreach ($order as $i => $orderItem) {
            if (is_string($orderItem)) {
                [$orderFieldOrigin, $orderDir] = Arr::explodeAndClear(' ', $orderItem, 2) + [null, null];

                $orderField = $this->resolveField($orderFieldOrigin);

                if (!$orderField) {
                    continue;
                }

                if ($dir !== null) {
                    $orderDir = $dir;
                }

                $orderDir ??= 'ASC';
                $orderDir = strtoupper($orderDir);

                if (is_string($orderField)) {
                    $orderData[$orderField] = [$orderField, $orderDir];
                } else {
                    $orderData[$orderFieldOrigin] = [$orderField, $orderDir];
                }
            }
        }

        $query = $helper->process($query, $orderData);

        return $query;
    }

    /**
     * @return int|null
     */
    public function getLimit(): ?int
    {
        return $this->limit ?? $this->getDefaultLimit();
    }

    /**
     * Method to get property SearchText
     *
     * @return  string|array
     *
     * @since  1.0.0
     */
    public function getSearchText(): string|array
    {
        return $this->searchText;
    }

    /**
     * @return bool
     */
    public function isDisableSelectGroup(): bool
    {
        return (bool) $this->getOption('disable_select_group');
    }

    /**
     * @param  bool  $disableSelectGroup
     *
     * @return  static  Return self to support chaining.
     */
    public function disableSelectGroup(bool $disableSelectGroup): static
    {
        $this->setOption('disable_select_group', $disableSelectGroup);

        return $this;
    }

    public function disablePageFix(bool $value): static
    {
        $this->setOption('page_fix', !$value);

        return $this;
    }

    /**
     * @return string|null
     */
    public function getDefaultItemClass(): ?string
    {
        return $this->defaultItemClass;
    }

    /**
     * @param  string|null  $defaultItemClass
     *
     * @return  static  Return self to support chaining.
     */
    public function setDefaultItemClass(?string $defaultItemClass): static
    {
        $this->defaultItemClass = $defaultItemClass;

        return $this;
    }

    protected function getInnerQuery(): Query
    {
        return $this->getQuery();
    }
}

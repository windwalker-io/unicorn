<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Windwalker\Core\Pagination\Pagination;
use Windwalker\Data\Collection;
use Windwalker\Query\Query;

/**
 * Interface ListRepositoryInterface
 */
interface ListRepositoryInterface extends \Countable, \IteratorAggregate
{
    public static function getEntityClass(): string;

    public function getQuery(): Query;

    public function all(): Collection;

    public function get(): object;

    public function page(int $page): static;

    public function limit(int $limit): static;

    public function count(): int;

    public function getOffset(): int;

    public function getPage(): int;

    /**
     * addFilter
     *
     * @param   string $key
     * @param   mixed  $value
     *
     * @return  static
     */
    public function addFilter(string $key, mixed $value): static;

    /**
     * addSearch
     *
     * @param   string $key
     * @param   mixed  $value
     *
     * @return  static
     */
    public function addSearch(string $key, mixed $value): static;

    /**
     * getPagination
     *
     * @param  int|null  $total
     *
     * @return Pagination
     */
    public function getPagination(?int $total = null): Pagination;
}

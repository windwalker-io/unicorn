<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use phpDocumentor\Reflection\ProjectFactory;
use Unicorn\Selector\ListSelector;
use Windwalker\Attributes\AttributesAccessor;
use Windwalker\Core\Pagination\PaginationFactory;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\SelectorQuery;

/**
 * Trait DatabaseRepositoryTrait
 */
trait DatabaseRepositoryTrait
{
    #[Inject]
    protected DatabaseAdapter $db;

    #[Inject]
    protected PaginationFactory $paginationFactory;

    // protected static ?string $entityClass = null;
    //
    // public static function getEntityClass(): string
    // {
    //     $class = static::$entityClass
    //         ??= AttributesAccessor::getFirstAttributeInstance(static::class, Table::class)->getName();
    //
    //     if ($class === null) {
    //         throw new \LogicException('No entity class set of : ' . static::class);
    //     }
    //
    //     return $class;
    // }

    public function getListSelector(): ListSelector
    {
        return $this->createSelector();
    }

    public function createSelector(): ListSelector
    {
        $selector = new ListSelector($this->db, $this->paginationFactory);

        $this->configureSelector($selector->getQuery(), $selector);

        return $selector;
    }

    abstract protected function configureSelector(SelectorQuery $query, ListSelector $selector): void;

    /**
     * @return DatabaseAdapter
     */
    public function getDb(): DatabaseAdapter
    {
        return $this->db;
    }

    /**
     * @param  DatabaseAdapter  $db
     *
     * @return  static  Return self to support chaining.
     */
    public function setDb(DatabaseAdapter $db): static
    {
        $this->db = $db;

        return $this;
    }
}

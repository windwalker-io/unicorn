<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Attributes\Repository;
use Unicorn\Selector\ListSelector;
use Windwalker\Attributes\AttributesAccessor;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Pagination\PaginationFactory;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\EntityMapper;
use Windwalker\ORM\SelectorQuery;

/**
 * Trait DatabaseRepositoryTrait
 */
trait DatabaseRepositoryTrait
{
    #[Inject]
    protected DatabaseAdapter $db;

    #[Inject]
    protected FormFactory $formFactory;

    protected ?Repository $metaAttribute = null;

    /**
     * getTable
     *
     * @return  string
     */
    public function getTable(): string
    {
        return $this->getMetaAttribute()->getTableAttribute()->getName();
    }

    /**
     * getEntityClass
     *
     * @return  string
     */
    public function getEntityClass(): string
    {
        return $this->getMetaAttribute()->getEntityClass();
    }

    protected function getMetaAttribute(): Repository
    {
        return $this->metaAttribute ??= AttributesAccessor::getFirstAttributeInstance(
            static::class,
            Repository::class,
            \ReflectionAttribute::IS_INSTANCEOF
        );
    }

    public function getEntityMapper(): EntityMapper
    {
        return $this->db->orm()->mapper($this->getEntityClass());
    }

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

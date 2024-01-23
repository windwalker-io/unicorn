<?php

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Attributes\Repository;
use Unicorn\Selector\ListSelector;
use Windwalker\Attributes\AttributesAccessor;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Manager\DatabaseManager;
use Windwalker\Core\Pagination\PaginationFactory;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\EntityMapper;
use Windwalker\ORM\ORM;
use Windwalker\ORM\SelectorQuery;

/**
 * Trait DatabaseRepositoryTrait
 */
trait DatabaseRepositoryTrait
{
    protected DatabaseAdapter $db;

    protected ?Repository $metaAttribute = null;

    #[Inject]
    protected DatabaseManager $databaseManager;

    #[Inject]
    protected FormFactory $formFactory;

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
        return $this->getDb()->orm()->mapper($this->getEntityClass());
    }

    public function getORM(): ORM
    {
        return $this->getDb()->orm();
    }

    /**
     * @return DatabaseAdapter
     */
    public function getDb(): DatabaseAdapter
    {
        return $this->db
            ??= $this->databaseManager->get($this->getMetaAttribute()->getConnection());
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

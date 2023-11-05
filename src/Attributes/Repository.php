<?php

declare(strict_types=1);

namespace Unicorn\Attributes;

use Windwalker\Attributes\AttributesAccessor;
use Windwalker\ORM\Attributes\Table;

/**
 * The Repository class.
 */
#[\Attribute(\Attribute::TARGET_CLASS)]
class Repository
{
    protected ?Table $table = null;

    /**
     * Repository constructor.
     */
    public function __construct(protected string $entityClass)
    {
    }

    /**
     * @return string
     */
    public function getEntityClass(): string
    {
        return $this->entityClass;
    }

    public function getTableAttribute(): Table
    {
        return $this->table ??= AttributesAccessor::getFirstAttributeInstance(
            $this->entityClass,
            Table::class,
            \ReflectionAttribute::IS_INSTANCEOF
        );
    }
}

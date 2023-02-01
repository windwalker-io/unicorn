<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Lyrasoft\Luna\Entity\Category;
use Windwalker\Query\Query;

/**
 * The CategoryFlatListField class.
 */
class CategoryFlatListField extends FlatListField
{
    protected ?string $table = Category::class;

    protected string $categoryType = '';

    protected ?int $maxLevel = null;

    protected function prepareQuery(Query $query): void
    {
        parent::prepareQuery($query);

        $query->where('category.type', $this->getCategoryType());
        $query->order('category.lft', 'ASC');

        if ($this->maxLevel) {
            $query->where('category.level', '<=', (int) $this->maxLevel);
        }
    }

    /**
     * @return string
     */
    public function getCategoryType(): string
    {
        return $this->categoryType;
    }

    /**
     * @param  string  $categoryType
     *
     * @return  static  Return self to support chaining.
     */
    public function categoryType(string $categoryType): static
    {
        $this->categoryType = $categoryType;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getMaxLevel(): ?int
    {
        return $this->maxLevel;
    }

    /**
     * @param  int|null  $maxLevel
     *
     * @return  static  Return self to support chaining.
     */
    public function maxLevel(?int $maxLevel): static
    {
        $this->maxLevel = $maxLevel;

        return $this;
    }
}

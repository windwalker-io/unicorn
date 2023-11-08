<?php

declare(strict_types=1);

namespace Unicorn\Model\Traits;

use Unicorn\Selector\ListSelector;

trait SoftDeleteRepositoryTrait
{
    public function createUndeletedListSelector(?string $alias = null): ListSelector
    {
        $column = 'is_deleted';

        if ($alias) {
            if (str_contains($alias, '.')) {
                $column = $alias;
            } else {
                $column = $alias . '.' . $column;
            }
        }

        return $this->createSelector()
            ->where($column, 0);
    }
}

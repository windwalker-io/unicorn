<?php

declare(strict_types=1);

namespace Unicorn\Model\Traits;

use Unicorn\Enum\PublishingState;
use Unicorn\Selector\ListSelector;

trait PublishingRepositoryTrait
{
    public function createUnTrashedListSelector(?string $alias = null): ListSelector
    {
        $column = static::getStateColumn($alias);

        return $this->createSelector()
            ->where($column, '>', PublishingState::TRASHED);
    }

    public function createLiveListSelector(?string $alias = null): ListSelector
    {
        $column = static::getStateColumn($alias);

        return $this->createSelector()
            ->where($column, '>', PublishingState::ARCHIVED);
    }

    public function createPublishedListSelector(?string $alias = null): ListSelector
    {
        $column = static::getStateColumn($alias);

        return $this->createSelector()
            ->where($column, '=', PublishingState::PUBLISHED);
    }

    /**
     * @param  string|null  $alias
     *
     * @return  string
     */
    protected static function getStateColumn(?string $alias): string
    {
        $column = 'state';

        if ($alias) {
            if (str_contains($alias, '.')) {
                $column = $alias;
            } else {
                $column = $alias . '.' . $column;
            }
        }

        return $column;
    }
}

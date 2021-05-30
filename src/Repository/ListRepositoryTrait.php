<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Selector\ListSelector;
use Windwalker\ORM\SelectorQuery;

/**
 * Trait ListRepositoryTrait
 */
trait ListRepositoryTrait
{
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
}

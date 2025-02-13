<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Selector\ListSelector;
use Windwalker\Core\Pagination\PaginationFactory;
use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\SelectorQuery;

/**
 * Trait ListRepositoryTrait
 */
trait ListRepositoryTrait
{
    #[Inject]
    protected ?PaginationFactory $paginationFactory = null;

    public function createSelector(?SelectorQuery &$query = null): ListSelector
    {
        $selector = $this->createSelectorObject();

        $this->configureSelector($query = $selector->getQuery(), $selector);

        return $selector;
    }

    protected function createSelectorObject(): ListSelector
    {
        return new ListSelector($this->db, $this->paginationFactory);
    }

    protected function configureSelector(SelectorQuery $query, ListSelector $selector): void
    {
        //
    }
}

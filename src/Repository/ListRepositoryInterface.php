<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Selector\ListSelector;
use Windwalker\ORM\SelectorQuery;

/**
 * Interface ListRepositoryInterface
 */
interface ListRepositoryInterface extends StateControlRepositoryInterface
{
    public function createSelector(SelectorQuery &$query = null): ListSelector;
}

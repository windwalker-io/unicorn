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

/**
 * Interface ListRepositoryInterface
 */
interface ListRepositoryInterface extends StateControlRepositoryInterface
{
    public function getListSelector(): ListSelector;
}

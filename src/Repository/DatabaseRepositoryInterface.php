<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Windwalker\Database\DatabaseAdapter;

/**
 * Interface DatabaseRepositoryInterface
 */
interface DatabaseRepositoryInterface
{
    public function getDb(): DatabaseAdapter;
}

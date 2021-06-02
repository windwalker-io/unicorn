<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Windwalker\Core\State\AppState;

/**
 * Interface StateControlRepositoryInterface
 */
interface StateControlRepositoryInterface
{
    public function getState(): AppState;
}

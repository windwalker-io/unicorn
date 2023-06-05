<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
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

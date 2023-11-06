<?php

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

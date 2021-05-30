<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\ReorderAction;

/**
 * Trait ManageRepositoryTrait
 */
trait ManageRepositoryTrait
{
    use CrudRepositoryTrait;

    public function createReorderAction(string $actionClass = ReorderAction::class): ReorderAction
    {
        return $this->createAction($actionClass, $this);
    }

    public function createBatchAction(string $actionClass = BatchAction::class): BatchAction
    {
        return $this->createAction($actionClass, $this);
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\ReorderAction;

/**
 * Interface ManageRepositoryInterface
 */
interface ManageRepositoryInterface extends CrudRepositoryInterface
{
    public function createReorderAction(string $actionClass = ReorderAction::class): ReorderAction;

    public function createBatchAction(string $actionClass = BatchAction::class): BatchAction;
}

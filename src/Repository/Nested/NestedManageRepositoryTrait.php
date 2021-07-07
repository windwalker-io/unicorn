<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository\Nested;

use Unicorn\Repository\Actions\NestedReorderAction;
use Unicorn\Repository\Actions\NestedSaveAction;
use Unicorn\Repository\ManageRepositoryTrait;

/**
 * The NestedManageRepositoryTrait class.
 */
trait NestedManageRepositoryTrait
{
    use ManageRepositoryTrait;

    public function createSaveAction(string $actionClass = NestedSaveAction::class): NestedSaveAction
    {
        return $this->createAction($actionClass, $this);
    }

    public function createReorderAction(string $actionClass = NestedReorderAction::class): NestedReorderAction
    {
        return $this->createAction($actionClass, $this);
    }
}

<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Repository\Actions\ActionsFactory;
use Unicorn\Repository\Actions\SaveAction;
use Windwalker\DI\Attributes\Inject;

/**
 * Trait CrudRepositoryTrait
 */
trait CrudRepositoryTrait
{
    use DatabaseRepositoryTrait;

    #[Inject]
    protected ActionsFactory $actionsFactory;

    public function createSaveAction($actionClass = SaveAction::class): SaveAction
    {
        /** @var SaveAction $action */
        $action = $this->actionsFactory->create($actionClass, $this);

        $this->configureSaveAction($action);

        return $action;
    }

    protected function configureSaveAction(SaveAction $action): void
    {
        //
    }
}

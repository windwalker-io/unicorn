<?php

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Repository\Actions\SaveAction;

/**
 * Interface CrudRepositoryInterface
 */
interface CrudRepositoryInterface extends
    ActionAwareInterface,
    DatabaseRepositoryInterface,
    StateControlRepositoryInterface
{
    public function createSaveAction(string $actionClass = SaveAction::class): SaveAction;

    /**
     * getItem
     *
     * @param  array        $conditions
     * @param  string|null  $className
     *
     * @psalm-template T
     * @psalm-param T       $className
     * @psalm-return T
     */
    public function getItem(array $conditions = [], ?string $className = null): ?object;

    public function delete(array $conditions = []): void;
}

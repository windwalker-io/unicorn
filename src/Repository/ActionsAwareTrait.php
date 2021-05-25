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
use Windwalker\DI\Attributes\Inject;

/**
 * Trait ActionsAwareTrait
 */
trait ActionsAwareTrait
{
    #[Inject]
    protected ActionsFactory $actionsFactory;

    protected bool $actionsConfigured = false;

    public function createAction(string $className, ...$args): object
    {
        return $this->actionsFactory->create($className, $this, ...$args);
    }

    public function configureAction(string $className, callable $handler, int $flags = 0): static
    {
        $this->actionsFactory->configure(
            $className,
            $handler,
            $flags
        );

        return $this;
    }

    /**
     * @return ActionsFactory
     */
    public function getActionsFactory(): ActionsFactory
    {
        $factory = $this->actionsFactory;

        $this->runConfigureActions($factory);

        return $factory;
    }

    private function runConfigureActions(ActionsFactory $actionsFactory): void
    {
        if (!$this->actionsConfigured) {
            $this->configureActions($actionsFactory);

            $this->actionsConfigured = true;
        }
    }

    abstract protected function configureActions(ActionsFactory $actionsFactory): void;
}

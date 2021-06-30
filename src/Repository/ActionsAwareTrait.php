<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Attributes\ConfigureAction;
use Unicorn\Repository\Actions\ActionsFactory;
use Windwalker\Attributes\AttributesAccessor;
use Windwalker\DI\Attributes\Inject;

use function Windwalker\arr;

/**
 * Trait ActionsAwareTrait
 */
trait ActionsAwareTrait
{
    #[Inject]
    protected ActionsFactory $actionsFactory;

    protected bool $actionsConfigured = false;

    /**
     * createAction
     *
     * @param  string  $className
     * @param  mixed   ...$args
     *
     * @return  object
     *
     * @psalm-template T
     * @psalm-param T $className
     * @psalm-return T
     */
    public function createAction(string $className, ...$args): object
    {
        return $this->getActionsFactory()->create($className, $this, ...$args);
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

    protected function configureActions(ActionsFactory $actionsFactory): void
    {
        foreach (get_class_methods($this) as $method) {
            AttributesAccessor::runAttributeIfExists(
                new \ReflectionMethod($this, $method),
                ConfigureAction::class,
                function (ConfigureAction $attr) use ($actionsFactory, $method) {
                    $actionsFactory->configure(
                        $attr->className,
                        fn (object $action) => $this->$method($action)
                    );
                },
                \ReflectionAttribute::IS_INSTANCEOF
            );
        }
    }
}

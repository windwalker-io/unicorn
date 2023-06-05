<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Unicorn\Attributes\ConfigureAction;
use Unicorn\Repository\Actions\ActionsFactory;
use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\SaveAction;
use Unicorn\Repository\Event\AfterBatchEvent;
use Unicorn\Repository\Event\AfterBatchItemEvent;
use Unicorn\Repository\Event\BeforeBatchEvent;
use Unicorn\Repository\Event\BeforeBatchItemEvent;
use Windwalker\Attributes\AttributesAccessor;
use Windwalker\DI\Attributes\Inject;

use Windwalker\ORM\Event\AfterCopyEvent;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\BeforeCopyEvent;
use Windwalker\ORM\Event\BeforeSaveEvent;

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
            $ref = new \ReflectionMethod($this, $method);

            AttributesAccessor::runAttributeIfExists(
                $ref,
                ConfigureAction::class,
                function (ConfigureAction $attr) use ($actionsFactory, $method) {
                    $actionsFactory->configure(
                        $attr->className,
                        fn (object $action) => $this->$method($action),
                        $attr->flags
                    );
                },
                \ReflectionAttribute::IS_INSTANCEOF
            );

            $this->runEventAttr($ref, SaveAction::class, BeforeSaveEvent::class);
            $this->runEventAttr($ref, SaveAction::class, AfterSaveEvent::class);
            $this->runEventAttr($ref, BatchAction::class, BeforeBatchItemEvent::class);
            $this->runEventAttr($ref, BatchAction::class, AfterBatchItemEvent::class);
            $this->runEventAttr($ref, BatchAction::class, BeforeBatchEvent::class);
            $this->runEventAttr($ref, BatchAction::class, AfterBatchEvent::class);
            $this->runEventAttr($ref, BatchAction::class, BeforeCopyEvent::class);
            $this->runEventAttr($ref, BatchAction::class, AfterCopyEvent::class);
        }
    }

    protected function runEventAttr(\ReflectionMethod $ref, string $actionClass, string $event): void
    {
        AttributesAccessor::runAttributeIfExists(
            $ref,
            $event,
            function (object $attr) use ($event, $actionClass, $ref) {
                $this->actionsFactory->configure(
                    $actionClass,
                    fn(object $action) => $action->on($event, [$this, $ref->getName()]),
                    ActionsFactory::IS_INSTANCE_OF
                );
            },
            \ReflectionAttribute::IS_INSTANCEOF
        );
    }
}

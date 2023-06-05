<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Windwalker\DI\Container;

/**
 * The ActionsFactory class.
 */
class ActionsFactory
{
    public const IS_INSTANCE_OF = 1;

    protected array $configures = [];

    /**
     * ActionsFactory constructor.
     */
    public function __construct(protected Container $container)
    {
    }

    /**
     * create
     *
     * @param  string  $class
     * @param  object  $repository
     *
     * @return  object
     *
     * @psalm-template T
     * @psalm-param T $class
     *
     * @psalm-return T
     */
    public function create(string $class, object $repository, ...$args): object
    {
        $args['repository'] = $repository;

        $instance = $this->container->newInstance($class, $args);

        $this->runConfigure($instance);

        return $instance;
    }

    protected function runConfigure(object $instance): object
    {
        foreach ($this->configures as $configure) {
            [$className, $handler, $flags] = $configure;

            if ($flags & static::IS_INSTANCE_OF) {
                if (is_a($instance, $className, true)) {
                    $handler($instance, $this->container) ?? $instance;
                }
            } else {
                if ($instance::class === trim($className, '\\')) {
                    $handler($instance, $this->container) ?? $instance;
                }
            }
        }

        return $instance;
    }

    public function configure(string $className, callable $handler, int $flags = 0): static
    {
        $this->configures[] = [
            $className,
            $handler,
            $flags
        ];

        return $this;
    }
}

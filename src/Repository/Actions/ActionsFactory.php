<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Windwalker\DI\Container;

/**
 * The ActionsFactory class.
 */
class ActionsFactory
{
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
    public function create(string $class, object $repository): object
    {
        return $this->container->newInstance(
            $class,
            [
                'repository' => $repository,
            ]
        );
    }
}

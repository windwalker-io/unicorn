<?php

declare(strict_types=1);

namespace Unicorn\Repository;

/**
 * Interface ActionAwareInterface
 */
interface ActionAwareInterface
{
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
    public function createAction(string $className, ...$args): object;
}

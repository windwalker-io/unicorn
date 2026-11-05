<?php

declare(strict_types=1);

namespace Unicorn\Tests\Repository;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Repository\Actions\ActionsFactory;
use Windwalker\DI\Container;

/**
 * Unit tests for ActionsFactory configure/create branching.
 */
class ActionsFactoryTest extends TestCase
{
    #[Test]
    public function configureExactMatchRunsHandlerForSameClass(): void
    {
        $factory = new ActionsFactory(new Container());
        $called = [];

        $factory->configure(
            ActionsFactoryTestBase::class,
            function (object $instance) use (&$called): void {
                $called[] = $instance::class;
            },
        );

        $factory->create(ActionsFactoryTestBase::class, new \stdClass());

        self::assertSame([ActionsFactoryTestBase::class], $called);
    }

    #[Test]
    public function configureExactMatchSkipsSubclass(): void
    {
        $factory = new ActionsFactory(new Container());
        $called = false;

        $factory->configure(
            ActionsFactoryTestBase::class,
            function () use (&$called): void {
                $called = true;
            },
        );

        $factory->create(ActionsFactoryTestChild::class, new \stdClass());

        self::assertFalse($called);
    }

    #[Test]
    public function configureInstanceOfRunsHandlerForSubclass(): void
    {
        $factory = new ActionsFactory(new Container());
        $called = false;

        $factory->configure(
            ActionsFactoryTestBase::class,
            function () use (&$called): void {
                $called = true;
            },
            ActionsFactory::IS_INSTANCE_OF,
        );

        $factory->create(ActionsFactoryTestChild::class, new \stdClass());

        self::assertTrue($called);
    }

    #[Test]
    public function configureInstanceOfSkipsUnrelatedClass(): void
    {
        $factory = new ActionsFactory(new Container());
        $called = false;

        $factory->configure(
            ActionsFactoryTestBase::class,
            function () use (&$called): void {
                $called = true;
            },
            ActionsFactory::IS_INSTANCE_OF,
        );

        $factory->create(\stdClass::class, new \stdClass());

        self::assertFalse($called);
    }

    #[Test]
    public function createPassesRepositoryArgToInstance(): void
    {
        $factory = new ActionsFactory(new Container());
        $repository = new \stdClass();
        $repository->name = 'repo';

        $action = $factory->create(ActionsFactoryTestBase::class, $repository);

        self::assertSame($repository, $action->repository);
    }
}

class ActionsFactoryTestBase
{
    public function __construct(public readonly ?object $repository = null) {}
}

class ActionsFactoryTestChild extends ActionsFactoryTestBase {}

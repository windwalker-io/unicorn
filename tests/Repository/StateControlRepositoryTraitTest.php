<?php

declare(strict_types=1);

namespace Unicorn\Tests\Repository\Stub\Foo\Bar;

use Unicorn\Repository\StateControlRepositoryTrait;

class NamespacedStateHolder
{
    use StateControlRepositoryTrait;

    public function setState(\Windwalker\Core\State\AppState $state): void
    {
        $this->state = $state;
    }
}

namespace Unicorn\Tests\Repository;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Repository\StateControlRepositoryTrait;
use Unicorn\Tests\Repository\Stub\Foo\Bar\NamespacedStateHolder;
use Windwalker\Core\State\AppState;
use Windwalker\DI\Container;

class StateControlRepositoryTraitTest extends TestCase
{
    #[Test]
    public function stateIsPrefixedByRepositoryNameWithoutSuffix(): void
    {
        $holder = new StateControlFlowRepository();
        $holder->setState(new AppState(new Container()));

        self::assertSame('StateControlFlow', $this->prefixOf($holder->getState()));
    }

    #[Test]
    public function stateIsPrefixedByNamespaceWhenNotRepositorySuffix(): void
    {
        $holder = new NamespacedStateHolder();
        $holder->setState(new AppState(new Container()));
        $holder->setModuleNamespaceBase('Unicorn\\Tests\\Repository');

        self::assertSame('stub.foo.bar', $this->prefixOf($holder->getState()));
    }

    #[Test]
    public function getStateDoesNotMutateOriginalState(): void
    {
        $holder = new StateControlFlowRepository();
        $state = new AppState(new Container());
        $holder->setState($state);

        $holder->getState();

        self::assertSame('', $this->prefixOf($state));
    }

    #[Test]
    public function moduleNamespaceBaseCanBeChanged(): void
    {
        $holder = new StateControlFlowRepository();

        self::assertSame('App\\Module', $holder->getModuleNamespaceBase());
        self::assertSame($holder, $holder->setModuleNamespaceBase('Foo'));
        self::assertSame('Foo', $holder->getModuleNamespaceBase());
    }

    private function prefixOf(AppState $state): string
    {
        return new \ReflectionProperty(AppState::class, 'prefix')->getValue($state);
    }
}

class StateControlFlowRepository
{
    use StateControlRepositoryTrait;

    public function setState(AppState $state): void
    {
        $this->state = $state;
    }
}

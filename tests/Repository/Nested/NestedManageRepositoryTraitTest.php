<?php

declare(strict_types=1);

namespace Unicorn\Tests\Repository\Nested;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Attributes\Repository;
use Unicorn\Repository\Actions\ReorderAction;
use Unicorn\Repository\ActionsAwareTrait;
use Unicorn\Repository\DatabaseRepositoryInterface;
use Unicorn\Repository\DatabaseRepositoryTrait;
use Unicorn\Repository\Nested\NestedManageRepositoryTrait;

class NestedManageRepositoryTraitTest extends TestCase
{
    #[Test]
    public function nestedReorderActionUsesLftAsOrderField(): void
    {
        $repo = new NestedTestRepository();
        $action = new ReorderAction($repo);

        self::assertSame('ordering', $action->getOrderField());

        new \ReflectionMethod($repo, 'configureNestedReorderAction')->invoke($repo, $action);

        self::assertSame('lft', $action->getOrderField());
    }
}

#[Repository(entityClass: \stdClass::class)]
class NestedTestRepository implements DatabaseRepositoryInterface
{
    use DatabaseRepositoryTrait;
    use ActionsAwareTrait;
    use NestedManageRepositoryTrait;
}

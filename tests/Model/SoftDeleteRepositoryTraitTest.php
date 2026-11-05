<?php

declare(strict_types=1);

namespace Unicorn\Tests\Model;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Model\Traits\SoftDeleteRepositoryTrait;
use Unicorn\Selector\ListSelector;

class SoftDeleteRepositoryTraitTest extends TestCase
{
    /**
     * Fake repository whose selector records `where()` calls instead of building real queries.
     */
    protected function createRepository(): object
    {
        $selector = new class () extends ListSelector {
            public array $wheres = [];

            public function __construct() {}

            public function where(mixed ...$args): static
            {
                $this->wheres[] = $args;

                return $this;
            }
        };

        return new class ($selector) {
            use SoftDeleteRepositoryTrait;

            public function __construct(private ListSelector $selector) {}

            public function createSelector(): ListSelector
            {
                return $this->selector;
            }

            public function getWheres(): array
            {
                return $this->selector->wheres;
            }
        };
    }

    #[Test]
    public function undeletedSelectorUsesDefaultColumn(): void
    {
        $repo = $this->createRepository();

        $repo->createUndeletedListSelector();

        self::assertSame([['is_deleted', 0]], $repo->getWheres());
    }

    #[Test]
    public function undeletedSelectorPrefixesAlias(): void
    {
        $repo = $this->createRepository();

        $repo->createUndeletedListSelector('foo');

        self::assertSame([['foo.is_deleted', 0]], $repo->getWheres());
    }

    #[Test]
    public function undeletedSelectorAliasWithDotIsUsedAsColumn(): void
    {
        $repo = $this->createRepository();

        $repo->createUndeletedListSelector('custom.col');

        self::assertSame([['custom.col', 0]], $repo->getWheres());
    }
}

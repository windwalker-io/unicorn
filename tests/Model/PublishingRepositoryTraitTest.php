<?php

declare(strict_types=1);

namespace Unicorn\Tests\Model;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Enum\PublishingState;
use Unicorn\Model\Traits\PublishingRepositoryTrait;
use Unicorn\Selector\ListSelector;

class PublishingRepositoryTraitTest extends TestCase
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
            use PublishingRepositoryTrait;

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
    public function untrashedSelectorUsesDefaultColumn(): void
    {
        $repo = $this->createRepository();

        $repo->createUnTrashedListSelector();

        self::assertSame(
            [['state', '>', PublishingState::TRASHED]],
            $repo->getWheres()
        );
    }

    #[Test]
    public function liveSelectorUsesArchivedThreshold(): void
    {
        $repo = $this->createRepository();

        $repo->createLiveListSelector('foo');

        self::assertSame(
            [['foo.state', '>', PublishingState::ARCHIVED]],
            $repo->getWheres()
        );
    }

    #[Test]
    public function publishedSelectorFiltersPublishedState(): void
    {
        $repo = $this->createRepository();

        $repo->createPublishedListSelector('foo');

        self::assertSame(
            [['foo.state', '=', PublishingState::PUBLISHED]],
            $repo->getWheres()
        );
    }

    #[Test]
    public function aliasWithoutDotIsPrefixed(): void
    {
        $repo = $this->createRepository();

        $repo->createPublishedListSelector('bar');

        self::assertSame(
            [['bar.state', '=', PublishingState::PUBLISHED]],
            $repo->getWheres()
        );
    }

    #[Test]
    public function aliasWithDotIsUsedAsColumn(): void
    {
        $repo = $this->createRepository();

        $repo->createPublishedListSelector('custom.col');

        self::assertSame(
            [['custom.col', '=', PublishingState::PUBLISHED]],
            $repo->getWheres()
        );
    }
}

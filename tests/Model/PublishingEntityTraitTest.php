<?php

declare(strict_types=1);

namespace Unicorn\Tests\Model;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Enum\PublishingState;
use Unicorn\Model\Contract\PublishingEntityInterface;
use Unicorn\Model\Traits\PublishingEntityTrait;
use Windwalker\Core\DateTime\Chronos;

class PublishingEntityTraitTest extends TestCase
{
    protected function createEntity(): object
    {
        return new class () implements PublishingEntityInterface {
            use PublishingEntityTrait;
        };
    }

    #[Test]
    public function deletedAtDefaultsToNull(): void
    {
        $entity = $this->createEntity();

        self::assertNull($entity->deletedAt);
    }

    #[Test]
    public function deletedAtAcceptsString(): void
    {
        $entity = $this->createEntity();

        $entity->deletedAt = '2024-01-02 03:04:05';

        self::assertInstanceOf(Chronos::class, $entity->deletedAt);
        self::assertSame('2024-01-02 03:04:05', $entity->deletedAt->format('Y-m-d H:i:s'));
    }

    #[Test]
    public function deletedAtAcceptsNull(): void
    {
        $entity = $this->createEntity();
        $entity->deletedAt = '2024-01-02 03:04:05';

        $entity->deletedAt = null;

        self::assertNull($entity->deletedAt);
    }

    #[Test]
    public function publish(): void
    {
        $entity = $this->createEntity();

        $result = $entity->publish();

        self::assertSame($entity, $result);
        self::assertSame(PublishingState::PUBLISHED, $entity->getState());
        self::assertTrue($entity->isPublished());
    }

    #[Test]
    public function unpublish(): void
    {
        $entity = $this->createEntity();
        $entity->publish();

        $result = $entity->unpublish();

        self::assertSame($entity, $result);
        self::assertSame(PublishingState::UNPUBLISHED, $entity->getState());
        self::assertFalse($entity->isPublished());
    }

    #[Test]
    public function makeTrashed(): void
    {
        $entity = $this->createEntity();

        $result = $entity->makeTrashed();

        self::assertSame($entity, $result);
        self::assertSame(PublishingState::TRASHED, $entity->getState());
        self::assertTrue($entity->isTrashed());
    }

    #[Test]
    public function makeArchived(): void
    {
        $entity = $this->createEntity();

        $result = $entity->makeArchived();

        self::assertSame($entity, $result);
        self::assertSame(PublishingState::ARCHIVED, $entity->getState());
        self::assertTrue($entity->isArchived());
    }

    #[Test]
    public function setStateWrapsValue(): void
    {
        $entity = $this->createEntity();

        $result = $entity->setState(1);

        self::assertSame($entity, $result);
        self::assertSame(PublishingState::PUBLISHED, $entity->getState());
    }

    #[Test]
    public function isPublishedReflectsState(): void
    {
        $entity = $this->createEntity();

        $entity->setState(PublishingState::PUBLISHED);
        self::assertTrue($entity->isPublished());

        $entity->setState(PublishingState::UNPUBLISHED);
        self::assertFalse($entity->isPublished());
    }

    /**
     * Known bug: PublishingEntityTrait::isUnpublished() currently returns isPublished().
     * This test documents the expected behavior and is expected to fail until fixed.
     */
    #[Test]
    public function isUnpublishedReflectsState(): void
    {
        $entity = $this->createEntity();

        $entity->setState(PublishingState::UNPUBLISHED);
        self::assertTrue($entity->isUnpublished());

        $entity->setState(PublishingState::PUBLISHED);
        self::assertFalse($entity->isUnpublished());
    }
}

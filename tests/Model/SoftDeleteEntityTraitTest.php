<?php

declare(strict_types=1);

namespace Unicorn\Tests\Model;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Model\Contract\SoftDeleteEntityInterface;
use Unicorn\Model\Traits\SortDeleteEntityTrait;
use Windwalker\Core\DateTime\Chronos;

class SoftDeleteEntityTraitTest extends TestCase
{
    protected function createEntity(): object
    {
        return new class () implements SoftDeleteEntityInterface {
            use SortDeleteEntityTrait;
        };
    }

    #[Test]
    public function defaultsToNotDeleted(): void
    {
        $entity = $this->createEntity();

        self::assertFalse($entity->isDeleted);
        self::assertNull($entity->deletedAt);
        self::assertFalse($entity->isDeleted());
        self::assertNull($entity->getDeletedAt());
    }

    #[Test]
    public function softDeleteSetsDeletedFlagAndTime(): void
    {
        $entity = $this->createEntity();

        $result = $entity->softDelete();

        self::assertSame($entity, $result);
        self::assertTrue($entity->isDeleted);
        self::assertTrue($entity->isDeleted());
        self::assertInstanceOf(Chronos::class, $entity->deletedAt);
        self::assertInstanceOf(Chronos::class, $entity->getDeletedAt());
    }

    #[Test]
    public function undeleteClearsDeletedFlagAndTime(): void
    {
        $entity = $this->createEntity();
        $entity->softDelete();

        $result = $entity->undelete();

        self::assertSame($entity, $result);
        self::assertFalse($entity->isDeleted);
        self::assertNull($entity->deletedAt);
    }

    #[Test]
    public function setIsDeletedFalseClearsDeletedAt(): void
    {
        $entity = $this->createEntity();

        $entity->setIsDeleted(true);
        $entity->setIsDeleted(false);

        self::assertFalse($entity->isDeleted());
        self::assertNull($entity->getDeletedAt());
    }

    #[Test]
    public function setDeletedAtAcceptsString(): void
    {
        $entity = $this->createEntity();

        $result = $entity->setDeletedAt('2024-01-02 03:04:05');

        self::assertSame($entity, $result);
        self::assertInstanceOf(Chronos::class, $entity->getDeletedAt());
        self::assertSame('2024-01-02 03:04:05', $entity->getDeletedAt()->format('Y-m-d H:i:s'));
    }

    #[Test]
    public function setDeletedAtAcceptsNull(): void
    {
        $entity = $this->createEntity();
        $entity->setDeletedAt('2024-01-02 03:04:05');

        $entity->setDeletedAt(null);

        self::assertNull($entity->getDeletedAt());
    }
}

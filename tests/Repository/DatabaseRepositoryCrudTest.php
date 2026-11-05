<?php

declare(strict_types=1);

namespace Unicorn\Tests\Repository;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Attributes\Repository;
use Unicorn\Model\Contract\SoftDeleteEntityInterface;
use Unicorn\Repository\ActionsAwareTrait;
use Unicorn\Repository\Actions\ActionsFactory;
use Unicorn\Repository\CrudRepositoryTrait;
use Unicorn\Repository\DatabaseRepositoryInterface;
use Unicorn\Repository\DatabaseRepositoryTrait;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\Core\Router\Exception\RouteNotFoundException;
use Windwalker\DI\Container;
use Windwalker\Core\Testing\Traits\InMemoryDatabaseTestTrait;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;

/**
 * Integration tests for the CRUD repository flow against SQLite :memory:.
 */
class DatabaseRepositoryCrudTest extends TestCase
{
    use InMemoryDatabaseTestTrait;

    protected function prepareInMemoryDatabaseSchema(\Windwalker\Database\DatabaseAdapter $db): void
    {
        $db->execute(
            'CREATE TABLE crud_test_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(255) NOT NULL
            )',
        );
    }

    #[Test]
    public function saveAndGetItem(): void
    {
        $repo = $this->createRepository();

        $saved = $repo->save(new CrudTestItem(title: 'Hello'));

        self::assertGreaterThan(0, $saved->id);

        $found = $repo->getItem($saved->id);

        self::assertNotNull($found);
        self::assertSame('Hello', $found->title);
    }

    #[Test]
    public function getItemReturnsNullWhenMissing(): void
    {
        $repo = $this->createRepository();

        self::assertNull($repo->getItem(9999));
    }

    #[Test]
    public function mustGetItemThrowsWhenMissing(): void
    {
        $repo = $this->createRepository();

        $this->expectException(RouteNotFoundException::class);

        $repo->mustGetItem(9999);
    }

    #[Test]
    public function deleteRemovesItem(): void
    {
        $repo = $this->createRepository();

        $saved = $repo->save(new CrudTestItem(title: 'To delete'));

        $repo->delete(['id' => $saved->id]);

        self::assertNull($repo->getItem($saved->id));
    }

    #[Test]
    public function saveUpdatesExistingItem(): void
    {
        $repo = $this->createRepository();

        $saved = $repo->save(new CrudTestItem(title: 'Original'));
        $saved->title = 'Updated';
        $repo->save($saved);

        self::assertSame('Updated', $repo->getItem($saved->id)->title);
    }

    #[Test]
    public function deleteSoftDeleteEntityMarksItemDeletedInsteadOfRemoving(): void
    {
        $repo = $this->createSoftDeleteRepository();

        $saved = $repo->save(new SoftDeleteTestItem(title: 'Soft'));

        $repo->delete(['id' => $saved->id]);

        $row = $this->db->select('*')
            ->from('soft_delete_test_items')
            ->where('id', $saved->id)
            ->get();

        self::assertNotNull($row);
        self::assertSame(1, (int) $row->is_deleted);
    }

    private function createSoftDeleteRepository(): SoftDeleteTestRepository
    {
        $this->db->execute(
            'CREATE TABLE IF NOT EXISTS soft_delete_test_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(255) NOT NULL,
                is_deleted INTEGER NOT NULL DEFAULT 0,
                deleted_at VARCHAR(64) NULL
            )',
        );

        $repo = new SoftDeleteTestRepository();
        $repo->setDb($this->db);
        $repo->setActionsFactory(new ActionsFactory(new Container()));

        return $repo;
    }

    private function createRepository(): CrudTestRepository
    {
        $repo = new CrudTestRepository();
        $repo->setDb($this->db);
        $repo->setActionsFactory(new ActionsFactory(new Container()));

        return $repo;
    }
}

#[Table('crud_test_items')]
class CrudTestItem
{
    #[Column('id')]
    #[PK(primary: true)]
    public ?int $id = null;

    #[Column('title')]
    public string $title = '';

    public function __construct(?string $title = null)
    {
        $this->title = $title ?? '';
    }
}

#[Repository(entityClass: CrudTestItem::class)]
class CrudTestRepository implements DatabaseRepositoryInterface
{
    use DatabaseRepositoryTrait;
    use ActionsAwareTrait;
    use CrudRepositoryTrait;

    public function setActionsFactory(ActionsFactory $actionsFactory): void
    {
        $this->actionsFactory = $actionsFactory;
    }
}

#[Table('soft_delete_test_items')]
class SoftDeleteTestItem implements SoftDeleteEntityInterface
{
    #[Column('id')]
    #[PK(primary: true)]
    public ?int $id = null;

    #[Column('title')]
    public string $title = '';

    #[Column('is_deleted')]
    public int $isDeleted = 0;

    #[Column('deleted_at')]
    public ?string $deletedAt = null;

    public function __construct(?string $title = null)
    {
        $this->title = $title ?? '';
    }

    public function isDeleted(): bool
    {
        return (bool) $this->isDeleted;
    }

    public function setIsDeleted(bool $isDeleted): static
    {
        $this->isDeleted = (int) $isDeleted;

        return $this;
    }

    public function getDeletedAt(): ?Chronos
    {
        return $this->deletedAt === null ? null : Chronos::parse($this->deletedAt);
    }

    public function setDeletedAt(\DateTimeInterface|string|int|null $deletedAt): static
    {
        $this->deletedAt = $deletedAt === null ? null : Chronos::parse($deletedAt)->toSQL();

        return $this;
    }
}

#[Repository(entityClass: SoftDeleteTestItem::class)]
class SoftDeleteTestRepository implements DatabaseRepositoryInterface
{
    use DatabaseRepositoryTrait;
    use ActionsAwareTrait;
    use CrudRepositoryTrait;

    public function setActionsFactory(ActionsFactory $actionsFactory): void
    {
        $this->actionsFactory = $actionsFactory;
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Tests\Repository;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Attributes\NewOrdering;
use Unicorn\Attributes\Repository;
use Unicorn\Repository\Actions\ActionsFactory;
use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\ReorderAction;
use Unicorn\Repository\ActionsAwareTrait;
use Unicorn\Repository\DatabaseRepositoryInterface;
use Unicorn\Repository\DatabaseRepositoryTrait;
use Unicorn\Repository\ManageRepositoryTrait;
use Windwalker\Core\Testing\Traits\InMemoryDatabaseTestTrait;
use Windwalker\DI\Container;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;

class ManageRepositoryTraitTest extends TestCase
{
    use InMemoryDatabaseTestTrait;

    protected function prepareInMemoryDatabaseSchema(\Windwalker\Database\DatabaseAdapter $db): void
    {
        foreach (['manage_last_items', 'manage_first_items', 'manage_plain_items'] as $table) {
            $db->execute(
                "CREATE TABLE {$table} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title VARCHAR(255) NOT NULL,
                    ordering INTEGER NOT NULL DEFAULT 0
                )",
            );
        }
    }

    #[Test]
    public function newOrderLastAssignsNextOrderingOnCreate(): void
    {
        $repo = $this->createRepository(ManageLastRepository::class);

        $a = $repo->createSaveAction()->save(new ManageLastItem('A'));
        $b = $repo->createSaveAction()->save(new ManageLastItem('B'));
        $c = $repo->createSaveAction()->save(new ManageLastItem('C'));

        self::assertSame(1, (int) $this->orderingOf($repo, $a->id));
        self::assertSame(2, (int) $this->orderingOf($repo, $b->id));
        self::assertSame(3, (int) $this->orderingOf($repo, $c->id));
    }

    #[Test]
    public function newOrderLastKeepsExplicitOrdering(): void
    {
        $repo = $this->createRepository(ManageLastRepository::class);

        $item = $repo->createSaveAction()->save(new ManageLastItem('A', 50));

        self::assertSame(50, (int) $this->orderingOf($repo, $item->id));
    }

    #[Test]
    public function newOrderFirstPlacesNewItemBeforeExistingOnes(): void
    {
        $repo = $this->createRepository(ManageFirstRepository::class);

        $a = $repo->createSaveAction()->save(new ManageFirstItem('A', 1));
        $b = $repo->createSaveAction()->save(new ManageFirstItem('B', 0));

        self::assertLessThan(
            (int) $this->orderingOf($repo, $a->id),
            (int) $this->orderingOf($repo, $b->id),
        );
    }

    #[Test]
    public function noNewOrderingAttributeLeavesOrderingUntouched(): void
    {
        $repo = $this->createRepository(ManagePlainRepository::class);

        $item = $repo->createSaveAction()->save(new ManagePlainItem('A'));

        self::assertSame(0, (int) $this->orderingOf($repo, $item->id));
    }

    #[Test]
    public function createsReorderAndBatchActions(): void
    {
        $repo = $this->createRepository(ManagePlainRepository::class);

        self::assertInstanceOf(ReorderAction::class, $repo->createReorderAction());
        self::assertInstanceOf(BatchAction::class, $repo->createBatchAction());
    }

    private function orderingOf(object $repo, int $id): mixed
    {
        return $repo->getItem($id)->ordering;
    }

    private function createRepository(string $class): object
    {
        $repo = new $class();
        $repo->setDb($this->db);
        $repo->setActionsFactory(new ActionsFactory(new Container()));

        return $repo;
    }
}

abstract class ManageBaseItem
{
    #[Column('id')]
    #[PK(primary: true)]
    public ?int $id = null;

    #[Column('title')]
    public string $title = '';

    #[Column('ordering')]
    public int $ordering = 0;

    public function __construct(?string $title = null, int $ordering = 0)
    {
        $this->title = $title ?? '';
        $this->ordering = $ordering;
    }
}

#[Table('manage_last_items')]
#[NewOrdering(NewOrdering::LAST)]
class ManageLastItem extends ManageBaseItem {}

#[Table('manage_first_items')]
#[NewOrdering(NewOrdering::FIRST)]
class ManageFirstItem extends ManageBaseItem {}

#[Table('manage_plain_items')]
class ManagePlainItem extends ManageBaseItem {}

trait ManageTestRepositoryTrait
{
    use DatabaseRepositoryTrait;
    use ActionsAwareTrait;
    use ManageRepositoryTrait;

    public function setActionsFactory(ActionsFactory $actionsFactory): void
    {
        $this->actionsFactory = $actionsFactory;
    }
}

#[Repository(entityClass: ManageLastItem::class)]
class ManageLastRepository implements DatabaseRepositoryInterface
{
    use ManageTestRepositoryTrait;
}

#[Repository(entityClass: ManageFirstItem::class)]
class ManageFirstRepository implements DatabaseRepositoryInterface
{
    use ManageTestRepositoryTrait;
}

#[Repository(entityClass: ManagePlainItem::class)]
class ManagePlainRepository implements DatabaseRepositoryInterface
{
    use ManageTestRepositoryTrait;
}

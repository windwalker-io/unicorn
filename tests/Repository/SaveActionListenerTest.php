<?php

declare(strict_types=1);

namespace Unicorn\Tests\Repository;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Repository\Actions\SaveAction;
use Unicorn\Repository\Actions\ActionsFactory;
use Unicorn\Repository\CrudRepositoryTrait;
use Unicorn\Repository\DatabaseRepositoryInterface;
use Unicorn\Repository\DatabaseRepositoryTrait;
use Unicorn\Repository\ActionsAwareTrait;
use Unicorn\Attributes\Repository;
use Windwalker\DI\Container;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\Core\Testing\Traits\InMemoryDatabaseTestTrait;
use Unicorn\Repository\Event\PrepareSaveEvent;

/**
 * Verifies SaveAction create/update listener filters and prepareSave listener.
 */
class SaveActionListenerTest extends TestCase
{
    use InMemoryDatabaseTestTrait;

    protected function prepareInMemoryDatabaseSchema(\Windwalker\Database\DatabaseAdapter $db): void
    {
        $db->execute(
            'CREATE TABLE save_listener_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(255) NOT NULL
            )',
        );
    }

    #[Test]
    public function beforeCreateRunsOnlyOnInsert(): void
    {
        $calls = [];
        [$repo, $action] = $this->createSaveAction();
        $action->beforeCreate(function () use (&$calls): void {
            $calls[] = 'create';
        });

        $saved = $action->save(new SaveListenerItem(title: 'A'));
        $action->save($saved);

        self::assertSame(['create'], $calls);
    }

    #[Test]
    public function afterCreateRunsOnlyOnInsert(): void
    {
        $calls = [];
        [$repo, $action] = $this->createSaveAction();
        $action->afterCreate(function () use (&$calls): void {
            $calls[] = 'create';
        });

        $saved = $action->save(new SaveListenerItem(title: 'A'));
        $action->save($saved);

        self::assertSame(['create'], $calls);
    }

    #[Test]
    public function beforeUpdateRunsOnlyOnUpdate(): void
    {
        $calls = [];
        [$repo, $action] = $this->createSaveAction();
        $action->beforeUpdate(function () use (&$calls): void {
            $calls[] = 'update';
        });

        $saved = $action->save(new SaveListenerItem(title: 'A'));
        $action->save($saved);

        self::assertSame(['update'], $calls);
    }

    #[Test]
    public function afterUpdateRunsOnlyOnUpdate(): void
    {
        $calls = [];
        [$repo, $action] = $this->createSaveAction();
        $action->afterUpdate(function () use (&$calls): void {
            $calls[] = 'update';
        });

        $saved = $action->save(new SaveListenerItem(title: 'A'));
        $action->save($saved);

        self::assertSame(['update'], $calls);
    }

    #[Test]
    public function prepareSaveListenerCanModifyData(): void
    {
        [$repo, $action] = $this->createSaveAction();
        $action->prepareSave(function (PrepareSaveEvent $event): void {
            $event->data['title'] = 'Modified';
        });

        $saved = $action->save(['title' => 'Original']);

        self::assertSame('Modified', $repo->getItem($saved->id)->title);
    }

    #[Test]
    public function processDataAndValidateIgnoreFlagsSkipFilterAndPrepare(): void
    {
        [$repo, $action] = $this->createSaveAction();

        $data = $action->processDataAndValidate(
            ['title' => 'X', 'extra' => 'drop-me'],
            null,
            [],
            SaveAction::IGNORE_FILTER | SaveAction::IGNORE_FORM_PREPARE | SaveAction::IGNORE_VALIDATE,
        );

        self::assertSame(['title' => 'X', 'extra' => 'drop-me'], $data);
    }

    /**
     * @return  array{0: SaveListenerRepository, 1: SaveAction}
     */
    private function createSaveAction(): array
    {
        $repo = new SaveListenerRepository();
        $repo->setDb($this->db);
        $repo->setActionsFactory(new ActionsFactory(new Container()));

        return [$repo, $repo->createSaveAction()];
    }
}

#[Table('save_listener_items')]
class SaveListenerItem
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

#[Repository(entityClass: SaveListenerItem::class)]
class SaveListenerRepository implements DatabaseRepositoryInterface
{
    use DatabaseRepositoryTrait;
    use ActionsAwareTrait;
    use CrudRepositoryTrait;

    public function setActionsFactory(ActionsFactory $actionsFactory): void
    {
        $this->actionsFactory = $actionsFactory;
    }
}

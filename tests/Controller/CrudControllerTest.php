<?php

declare(strict_types=1);

namespace Unicorn\Tests\Controller;

use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Controller\CrudController;
use Unicorn\Repository\Actions\DeleteAction;
use Unicorn\Repository\Actions\SaveAction;
use Unicorn\Repository\CrudRepositoryInterface;
use Unicorn\Repository\Event\PrepareSaveEvent;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Core\State\AppState;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\Form\Form;
use Windwalker\ORM\Event\AfterDeleteEvent;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\BeforeDeleteEvent;
use Windwalker\ORM\Event\BeforeSaveEvent;
use Windwalker\ORM\NestedSetMapper;

/**
 * Verifies the generic CRUD controller orchestrates repository actions,
 * flash messages and navigation correctly, without touching a real database.
 */
final class CrudControllerTest extends TestCase
{
    private CrudController $controller;

    #[Before]
    public function initializeController(): void
    {
        $lang = $this->createStub(LangService::class);
        $lang->method('extract')->willReturnSelf();
        $lang->method('trans')->willReturnArgument(0);

        $this->controller = new CrudController($lang);
    }

    #[Test]
    public function saveReturnsSelfRouteWithSavedItemId(): void
    {
        $item = $this->savedEntity(42);

        $action = $this->createStub(SaveAction::class);
        $action->method('getForm')->willReturn($this->createStub(Form::class));
        $action->method('processDataAndSave')->willReturn($item);

        $repository = $this->createMock(CrudRepositoryInterface::class);
        $repository->method('createSaveAction')->willReturn($action);
        $repository->expects($this->never())->method('getState');

        $selfRoute = $this->createMock(RouteUri::class);
        $selfRoute->expects($this->once())->method('id')->with(42)->willReturnSelf();

        $nav = $this->createStub(Navigator::class);
        $nav->method('self')->willReturn($selfRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('item')->willReturn(['title' => 'Foo']);
        $app->expects($this->once())
            ->method('addMessage')
            ->with('save.success', 'success');

        $result = $this->controller->save($app, $nav, $repository, form: null);

        self::assertSame($selfRoute, $result);
    }

    #[Test]
    public function saveSkipsFlashMessageWhenMuted(): void
    {
        $item = $this->savedEntity(1);

        $action = $this->createStub(SaveAction::class);
        $action->method('getForm')->willReturn($this->createStub(Form::class));
        $action->method('processDataAndSave')->willReturn($item);

        $repository = $this->createStub(CrudRepositoryInterface::class);
        $repository->method('createSaveAction')->willReturn($action);

        $selfRoute = $this->createStub(RouteUri::class);
        $selfRoute->method('id')->willReturnSelf();

        $nav = $this->createStub(Navigator::class);
        $nav->method('self')->willReturn($selfRoute);

        $app = $this->createMock(AppContext::class);
        $app->method('input')->willReturn([]);
        $app->expects($this->never())->method('addMessage');

        $this->controller->setMuted(true);

        $this->controller->save($app, $nav, $repository, form: null);
    }

    #[Test]
    public function saveRemembersInputAndRethrowsOnRuntimeException(): void
    {
        $action = $this->createStub(SaveAction::class);
        $action->method('getForm')->willReturn($this->createStub(Form::class));
        $action->method('processDataAndSave')->willThrowException(new \RuntimeException('invalid'));

        $state = $this->createMock(AppState::class);
        $state->expects($this->once())
            ->method('remember')
            ->with('edit.data', ['title' => 'Bad']);

        $repository = $this->createStub(CrudRepositoryInterface::class);
        $repository->method('createSaveAction')->willReturn($action);
        $repository->method('getState')->willReturn($state);

        $nav = $this->createStub(Navigator::class);
        $app = $this->createMock(AppContext::class);
        $app->expects($this->exactly(2))->method('input')->with('item')->willReturn(['title' => 'Bad']);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('invalid');

        $this->controller->save($app, $nav, $repository, form: null);
    }

    #[Test]
    public function saveWithNamespaceWrapsDataUnderNamespaceAndSaves(): void
    {
        $item = $this->savedEntity(7);

        $action = $this->createMock(SaveAction::class);
        $action->method('getForm')->willReturn($this->createStub(Form::class));
        $action->expects($this->once())
            ->method('processDataAndValidate')
            ->with(['item' => ['title' => 'Foo']])
            ->willReturn(['item' => ['title' => 'Foo', 'slug' => 'foo']]);
        $action->expects($this->once())
            ->method('save')
            ->with(['title' => 'Foo', 'slug' => 'foo'])
            ->willReturn($item);

        $repository = $this->createStub(CrudRepositoryInterface::class);
        $repository->method('createSaveAction')->willReturn($action);

        $selfRoute = $this->createStub(RouteUri::class);
        $selfRoute->method('id')->willReturnSelf();

        $nav = $this->createStub(Navigator::class);
        $nav->method('self')->willReturn($selfRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('item')->willReturn(['title' => 'Foo']);

        $result = $this->controller->saveWithNamespace($app, $nav, $repository, form: null);

        self::assertSame($selfRoute, $result);
    }

    #[Test]
    public function saveWithNamespaceWorksWithoutNamespace(): void
    {
        $item = $this->savedEntity(9);

        $action = $this->createMock(SaveAction::class);
        $action->method('getForm')->willReturn($this->createStub(Form::class));
        $action->expects($this->once())
            ->method('processDataAndValidate')
            ->with(['title' => 'Foo'])
            ->willReturn(['title' => 'Foo']);
        $action->expects($this->once())
            ->method('save')
            ->with(['title' => 'Foo'])
            ->willReturn($item);

        $repository = $this->createStub(CrudRepositoryInterface::class);
        $repository->method('createSaveAction')->willReturn($action);

        $selfRoute = $this->createStub(RouteUri::class);
        $selfRoute->method('id')->willReturnSelf();

        $nav = $this->createStub(Navigator::class);
        $nav->method('self')->willReturn($selfRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with(null)->willReturn(['title' => 'Foo']);

        $this->controller->saveWithNamespace($app, $nav, $repository, form: null, namespace: null);
    }

    #[Test]
    public function rememberForCloneUnsetsMainKeyWhenPresent(): void
    {
        $mapper = $this->createStub(NestedSetMapper::class);
        $mapper->method('getMainKey')->willReturn('id');

        $state = $this->createMock(AppState::class);
        $state->expects($this->once())
            ->method('remember')
            ->with('edit.data', ['title' => 'Foo']);

        $repository = $this->createStub(CrudRepositoryInterface::class);
        $repository->method('getEntityMapper')->willReturn($mapper);
        $repository->method('getState')->willReturn($state);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('item')->willReturn(['id' => 5, 'title' => 'Foo']);

        $this->controller->rememberForClone($app, $repository);
    }

    #[Test]
    public function rememberForCloneKeepsDataWhenNoMainKey(): void
    {
        $mapper = $this->createStub(NestedSetMapper::class);
        $mapper->method('getMainKey')->willReturn(null);

        $state = $this->createMock(AppState::class);
        $state->expects($this->once())
            ->method('remember')
            ->with('edit.data', ['title' => 'Foo']);

        $repository = $this->createStub(CrudRepositoryInterface::class);
        $repository->method('getEntityMapper')->willReturn($mapper);
        $repository->method('getState')->willReturn($state);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('item')->willReturn(['title' => 'Foo']);

        $this->controller->rememberForClone($app, $repository);
    }

    #[Test]
    public function deleteReturnsBackImmediatelyWhenNoIds(): void
    {
        $repository = $this->createMock(CrudRepositoryInterface::class);
        $repository->expects($this->never())->method('createDeleteAction');
        $repository->expects($this->never())->method('getDb');

        $backRoute = $this->createStub(RouteUri::class);

        $nav = $this->createMock(Navigator::class);
        $nav->expects($this->once())->method('back')->willReturn($backRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('id')->willReturn(null);

        $result = $this->controller->delete($app, $nav, $repository);

        self::assertSame($backRoute, $result);
    }

    #[Test]
    public function deletesIdsThroughTransactionAndFlashesMessage(): void
    {
        $mapper = $this->createStub(NestedSetMapper::class);
        $mapper->method('getMainKey')->willReturn('id');

        $action = $this->createMock(DeleteAction::class);
        $action->expects($this->once())
            ->method('delete')
            ->with(['id' => [1, 2]]);

        $db = $this->createMock(DatabaseAdapter::class);
        $db->expects($this->once())
            ->method('transaction')
            ->willReturnCallback(fn(callable $cb) => $cb());

        $repository = $this->createStub(CrudRepositoryInterface::class);
        $repository->method('getEntityMapper')->willReturn($mapper);
        $repository->method('createDeleteAction')->willReturn($action);
        $repository->method('getDb')->willReturn($db);

        $backRoute = $this->createStub(RouteUri::class);
        $nav = $this->createStub(Navigator::class);
        $nav->method('back')->willReturn($backRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())
            ->method('addMessage')
            ->with('batch.delete.success', 'success');

        $result = $this->controller->delete($app, $nav, $repository, [1, 2]);

        self::assertSame($backRoute, $result);
    }

    #[Test]
    public function prepareSaveRegistersListenerOnEventEmitter(): void
    {
        $received = null;

        $this->controller->prepareSave(function (PrepareSaveEvent $event) use (&$received) {
            $received = $event;
        });

        $event = new PrepareSaveEvent(data: ['a' => 1], source: ['a' => 1], condFields: null, options: 0);

        $this->controller->emit($event);

        self::assertSame($event, $received);
    }

    #[Test]
    public function beforeSaveRegistersListenerOnEventEmitter(): void
    {
        $called = false;

        $this->controller->beforeSave(function (BeforeSaveEvent $event) use (&$called) {
            $called = true;
        });

        $this->controller->emit(new BeforeSaveEvent(type: 'create', source: [], data: []));

        self::assertTrue($called);
    }

    #[Test]
    public function afterSaveRegistersListenerOnEventEmitter(): void
    {
        $called = false;

        $this->controller->afterSave(function (AfterSaveEvent $event) use (&$called) {
            $called = true;
        });

        $this->controller->emit(new AfterSaveEvent(type: 'create', source: [], data: []));

        self::assertTrue($called);
    }

    #[Test]
    public function beforeDeleteRegistersListenerOnEventEmitter(): void
    {
        $called = false;

        $this->controller->beforeDelete(function (BeforeDeleteEvent $event) use (&$called) {
            $called = true;
        });

        $this->controller->emit(new BeforeDeleteEvent(conditions: []));

        self::assertTrue($called);
    }

    #[Test]
    public function afterDeleteRegistersListenerOnEventEmitter(): void
    {
        $called = false;

        $this->controller->afterDelete(function (AfterDeleteEvent $event) use (&$called) {
            $called = true;
        });

        $this->controller->emit(new AfterDeleteEvent(conditions: []));

        self::assertTrue($called);
    }

    private function savedEntity(int $id): object
    {
        return new class ($id) {
            public function __construct(private readonly int $id) {}

            public function getId(): int
            {
                return $this->id;
            }
        };
    }

    #[Test]
    public function formNamespaceGetterAndSetterAreFluent(): void
    {
        self::assertSame('item', $this->controller->getFormNamespace());

        $result = $this->controller->setFormNamespace('record');

        self::assertSame($this->controller, $result);
        self::assertSame('record', $this->controller->getFormNamespace());
    }

    #[Test]
    public function mutedGetterAndSetterAreFluent(): void
    {
        self::assertFalse($this->controller->isMuted());

        $result = $this->controller->setMuted(true);

        self::assertSame($this->controller, $result);
        self::assertTrue($this->controller->isMuted());
    }
}

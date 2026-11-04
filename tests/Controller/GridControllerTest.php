<?php

declare(strict_types=1);

namespace Unicorn\Tests\Controller;

use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Controller\GridController;
use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\ReorderAction;
use Unicorn\Repository\ListRepositoryInterface;
use Unicorn\Repository\ManageRepositoryInterface;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Core\State\AppState;

/**
 * Verifies the generic grid/batch controller dispatches batch tasks,
 * applies reordering actions and flashes messages correctly, without
 * touching a real database.
 */
final class GridControllerTest extends TestCase
{
    private GridController $controller;

    #[Before]
    public function initializeController(): void
    {
        $lang = $this->createStub(LangService::class);
        $lang->method('extract')->willReturnSelf();
        $lang->method('trans')->willReturnArgument(0);
        $lang->method('has')->willReturn(false);

        $this->controller = new GridController($lang);
    }

    #[Test]
    public function filterUsesRepositoryStateWhenRepositoryProvided(): void
    {
        $state = $this->createMock(AppState::class);
        $state->expects($this->exactly(2))->method('rememberMergeRequest');
        $state->expects($this->exactly(2))->method('rememberFromRequest');
        $state->expects($this->once())->method('forget')->with('page');

        $repository = $this->createStub(ListRepositoryInterface::class);
        $repository->method('getState')->willReturn($state);

        $selfRoute = $this->createMock(RouteUri::class);
        $selfRoute->expects($this->once())->method('allowQuery')->with(true)->willReturnSelf();

        $nav = $this->createStub(Navigator::class);
        $nav->method('self')->willReturn($selfRoute);

        $result = $this->controller->filter($nav, $repository);

        self::assertSame($selfRoute, $result);
    }

    #[Test]
    public function filterUsesExplicitStateWhenNoRepositoryProvided(): void
    {
        $state = $this->createMock(AppState::class);
        $state->expects($this->exactly(2))->method('rememberMergeRequest');

        $selfRoute = $this->createStub(RouteUri::class);
        $selfRoute->method('allowQuery')->willReturnSelf();

        $nav = $this->createStub(Navigator::class);
        $nav->method('self')->willReturn($selfRoute);

        $this->controller->filter($nav, null, $state);
    }

    #[Test]
    public function batchDispatchesToMatchingBatchMethod(): void
    {
        $repository = $this->createStub(ManageRepositoryInterface::class);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('task')->willReturn('move');
        $app->expects($this->once())
            ->method('call')
            ->with([$this->controller, 'batchMove'], ['repository' => $repository, 'ids' => null, 'task' => 'move', 'data' => null])
            ->willReturn('dispatched');

        $result = $this->controller->batch($app, $repository);

        self::assertSame('dispatched', $result);
    }

    #[Test]
    public function batchFallsBackToBatchUpdateWhenTaskMethodMissing(): void
    {
        $repository = $this->createStub(ManageRepositoryInterface::class);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('task')->willReturn('doesnotexist');
        $app->expects($this->once())
            ->method('call')
            ->with(
                [$this->controller, 'batchUpdate'],
                ['repository' => $repository, 'ids' => null, 'task' => 'doesnotexist', 'data' => null]
            )
            ->willReturn('fallback');

        $result = $this->controller->batch($app, $repository);

        self::assertSame('fallback', $result);
    }

    #[Test]
    public function batchFallsBackToBatchUpdateWhenNoTaskGiven(): void
    {
        $repository = $this->createStub(ManageRepositoryInterface::class);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('task')->willReturn(null);
        $app->expects($this->once())
            ->method('call')
            ->with([$this->controller, 'batchUpdate'], ['repository' => $repository, 'ids' => null, 'task' => null, 'data' => null])
            ->willReturn('fallback');

        $result = $this->controller->batch($app, $repository);

        self::assertSame('fallback', $result);
    }

    #[Test]
    public function batchUpdateUpdatesItemsAndFlashesGenericMessage(): void
    {
        $action = $this->createMock(BatchAction::class);
        $action->expects($this->once())
            ->method('update')
            ->with([1, 2], ['status' => 1])
            ->willReturn([]);

        $repository = $this->createStub(ManageRepositoryInterface::class);
        $repository->method('createBatchAction')->willReturn($action);

        $backRoute = $this->createStub(RouteUri::class);
        $nav = $this->createStub(Navigator::class);
        $nav->method('back')->willReturn($backRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('task')->willReturn(null);
        $app->expects($this->once())
            ->method('addMessage')
            ->with('update.success', 'success');

        $result = $this->controller->batchUpdate($app, $nav, $repository, [1, 2], null, ['status' => 1]);

        self::assertSame($backRoute, $result);
    }

    #[Test]
    public function batchUpdateUsesTaskSpecificMessageWhenAvailable(): void
    {
        $lang = $this->createStub(LangService::class);
        $lang->method('extract')->willReturnSelf();
        $lang->method('trans')->willReturnArgument(0);
        $lang->method('has')->willReturn(true);

        $controller = new GridController($lang);

        $action = $this->createStub(BatchAction::class);
        $action->method('update')->willReturn([]);

        $repository = $this->createStub(ManageRepositoryInterface::class);
        $repository->method('createBatchAction')->willReturn($action);

        $backRoute = $this->createStub(RouteUri::class);
        $nav = $this->createStub(Navigator::class);
        $nav->method('back')->willReturn($backRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())
            ->method('addMessage')
            ->with('publish.success', 'success');

        $controller->batchUpdate($app, $nav, $repository, [1], 'publish', ['status' => 1]);
    }

    #[Test]
    public function batchUpdateSkipsFlashMessageWhenMuted(): void
    {
        $action = $this->createStub(BatchAction::class);
        $action->method('update')->willReturn([]);

        $repository = $this->createStub(ManageRepositoryInterface::class);
        $repository->method('createBatchAction')->willReturn($action);

        $backRoute = $this->createStub(RouteUri::class);
        $nav = $this->createStub(Navigator::class);
        $nav->method('back')->willReturn($backRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->never())->method('addMessage');

        $this->controller->setMuted(true);

        $this->controller->batchUpdate($app, $nav, $repository, [1], null, ['status' => 1]);
    }

    #[Test]
    public function copyDuplicatesItemsAndFlashesMessage(): void
    {
        $action = $this->createMock(BatchAction::class);
        $action->expects($this->once())
            ->method('copy')
            ->with([1, 2], ['title' => 'Copy']);

        $repository = $this->createStub(ManageRepositoryInterface::class);
        $repository->method('createBatchAction')->willReturn($action);

        $backRoute = $this->createStub(RouteUri::class);
        $nav = $this->createStub(Navigator::class);
        $nav->method('back')->willReturn($backRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())
            ->method('addMessage')
            ->with('copy.success', 'success');

        $result = $this->controller->copy($app, $nav, $repository, [1, 2], ['title' => 'Copy']);

        self::assertSame($backRoute, $result);
    }

    #[Test]
    public function batchMoveDelegatesToReorderAction(): void
    {
        $reorderAction = $this->createMock(ReorderAction::class);
        $reorderAction->expects($this->once())->method('move')->with([1, 2], 1);

        $repository = $this->createStub(ManageRepositoryInterface::class);
        $repository->method('createReorderAction')->willReturn($reorderAction);

        $backRoute = $this->createStub(RouteUri::class);
        $nav = $this->createStub(Navigator::class);
        $nav->method('back')->willReturn($backRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())
            ->method('addMessage')
            ->with('reorder.success', 'success');

        $result = $this->controller->batchMove($app, $nav, $repository, [1, 2], 1);

        self::assertSame($backRoute, $result);
    }

    #[Test]
    public function batchReorderDelegatesToReorderAction(): void
    {
        $reorderAction = $this->createMock(ReorderAction::class);
        $reorderAction->expects($this->once())->method('reorder')->with([3 => 1, 1 => 2]);

        $repository = $this->createStub(ManageRepositoryInterface::class);
        $repository->method('createReorderAction')->willReturn($reorderAction);

        $backRoute = $this->createStub(RouteUri::class);
        $nav = $this->createStub(Navigator::class);
        $nav->method('back')->willReturn($backRoute);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())
            ->method('addMessage')
            ->with('reorder.success', 'success');

        $result = $this->controller->batchReorder($app, $nav, $repository, [3 => 1, 1 => 2]);

        self::assertSame($backRoute, $result);
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

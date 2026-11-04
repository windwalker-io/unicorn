<?php

declare(strict_types=1);

namespace Unicorn\Tests\Controller;

use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Router\Exception\RouteNotFoundException;

if (!defined('WINDWALKER_DEBUG')) {
    define('WINDWALKER_DEBUG', false);
}

/**
 * Fixture controller exposing both Ajax-tagged and plain task methods.
 *
 * Keep this fixture while tests exercise AjaxControllerTrait.
 */
final class AjaxControllerFixture
{
    use AjaxControllerTrait;

    #[Ajax]
    public function index(): array
    {
        return ['task' => 'index'];
    }

    #[Ajax]
    public function allowed(): array
    {
        return ['task' => 'allowed'];
    }

    public function notTagged(): array
    {
        return ['task' => 'notTagged'];
    }
}

/**
 * Verifies ajax task dispatching rejects missing or non-Ajax methods and
 * delegates valid ones to the application without booting a real router.
 */
final class AjaxControllerTraitTest extends TestCase
{
    private AjaxControllerFixture $controller;

    #[Before]
    public function initializeController(): void
    {
        $this->controller = new AjaxControllerFixture();
    }

    #[Test]
    public function ajaxDefaultsToIndexTaskAndDelegatesToApp(): void
    {
        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('task')->willReturn(null);
        $app->expects($this->once())
            ->method('call')
            ->with([$this->controller, 'index'])
            ->willReturn(['task' => 'index']);

        self::assertSame(['task' => 'index'], $this->controller->ajax($app));
    }

    #[Test]
    public function ajaxDelegatesToTheRequestedAjaxTaggedMethod(): void
    {
        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('task')->willReturn('allowed');
        $app->expects($this->once())
            ->method('call')
            ->with([$this->controller, 'allowed'])
            ->willReturn(['task' => 'allowed']);

        self::assertSame(['task' => 'allowed'], $this->controller->ajax($app));
    }

    #[Test]
    public function ajaxThrowsWhenTheTaskMethodDoesNotExist(): void
    {
        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('task')->willReturn('missing');

        $this->expectException(RouteNotFoundException::class);

        $this->controller->ajax($app);
    }

    #[Test]
    public function ajaxThrowsWhenTheTaskMethodIsNotAjaxTagged(): void
    {
        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())->method('input')->with('task')->willReturn('notTagged');

        $this->expectException(RouteNotFoundException::class);

        $this->controller->ajax($app);
    }
}

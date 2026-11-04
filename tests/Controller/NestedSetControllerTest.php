<?php

declare(strict_types=1);

namespace Unicorn\Tests\Controller;

use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Controller\NestedSetController;
use Unicorn\Repository\DatabaseRepositoryInterface;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\ORM\NestedSetMapper;

/**
 * Verifies the nested set rebuild task rebuilds the tree, reports success
 * and redirects back without booting a real application or database.
 */
final class NestedSetControllerTest extends TestCase
{
    private NestedSetController $controller;

    #[Before]
    public function initializeController(): void
    {
        $this->controller = new NestedSetController();

        $lang = $this->createStub(LangService::class);
        $lang->method('trans')->willReturnArgument(0);

        new \ReflectionProperty($this->controller, 'lang')->setValue($this->controller, $lang);
    }

    #[Test]
    public function rebuildRebuildsTheTreeAndRedirectsBack(): void
    {
        $mapper = $this->createMock(NestedSetMapper::class);
        $mapper->expects($this->once())->method('rebuild')->with(1);

        $repository = $this->createStub(DatabaseRepositoryInterface::class);
        $repository->method('getEntityMapper')->willReturn($mapper);

        $routeUri = $this->createStub(RouteUri::class);

        $nav = $this->createMock(Navigator::class);
        $nav->expects($this->once())->method('back')->willReturn($routeUri);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())
            ->method('addMessage')
            ->with('unicorn.message.batch.rebuild.success', 'success');

        $result = $this->controller->rebuild($app, $repository, $nav);

        self::assertSame($routeUri, $result);
    }
}

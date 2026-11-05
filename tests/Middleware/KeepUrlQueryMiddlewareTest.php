<?php

declare(strict_types=1);

namespace Unicorn\Tests\Middleware;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Http\AppRequest;
use Windwalker\Core\Router\Event\BeforeRouteBuildEvent;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\NavOptions;
use Windwalker\Core\Router\Route;
use Windwalker\Core\View\Event\BeforeRenderEvent;
use Unicorn\Middleware\KeepUrlQueryMiddleware;

#[CoversClass(KeepUrlQueryMiddleware::class)]
class KeepUrlQueryMiddlewareTest extends TestCase
{
    private function makeRequest(array $inputs): AppRequest
    {
        $request = $this->createStub(AppRequest::class);
        $request->method('input')
            ->willReturnCallback(fn(string $name) => $inputs[$name] ?? null);

        return $request;
    }

    private function makeHandler(): RequestHandlerInterface
    {
        $response = $this->createStub(ResponseInterface::class);

        $handler = $this->createMock(RequestHandlerInterface::class);
        $handler->expects($this->once())
            ->method('handle')
            ->willReturn($response);

        return $handler;
    }

    private function makeRoute(array $middlewares): Route
    {
        $middlewares = array_map(
            fn($item) => $item === KeepUrlQueryMiddleware::class
                ? $this->makeMiddleware([], $this->createStub(Navigator::class))
                : $item,
            $middlewares
        );

        $route = $this->createStub(Route::class);
        $route->method('getExtraValue')
            ->willReturnCallback(fn(string $name) => $name === 'middlewares' ? $middlewares : null);

        return $route;
    }

    /**
     * Captures the callback registered via navigator->on(BeforeRouteBuildEvent).
     */
    private function captureRouteListener(
        Navigator $navigator,
        ?\Closure &$listener
    ): void {
        $navigator->expects($this->once())
            ->method('on')
            ->willReturnCallback(function (string $event, \Closure $callback) use (&$listener, $navigator): Navigator {
                $this->assertSame(BeforeRouteBuildEvent::class, $event);
                $listener = $callback;

                return $navigator;
            });
    }

    private function makeNavigator(?Route $found = null): Navigator
    {
        $navigator = $this->createMock(Navigator::class);

        if ($found !== null) {
            $navigator->method('findRoute')->willReturn($found);
        } else {
            $navigator->method('findRoute')->willReturn(null);
        }

        return $navigator;
    }

    private function makeAppContext(): AppContext
    {
        return $this->createStub(AppContext::class);
    }

    private function makeMiddleware(
        array $inputs,
        Navigator $navigator,
        array $options = [],
    ): KeepUrlQueryMiddleware {
        return new KeepUrlQueryMiddleware(
            $this->makeAppContext(),
            $this->makeRequest($inputs),
            $navigator,
            $options['key'] ?? 'lang',
            $options['uid'] ?? '',
            $options['default'] ?? '',
            $options['route_enabled'] ?? true,
            $options['after_hook'] ?? null,
            $options['view_hook'] ?? null,
        );
    }

    private function makeEvent(string $route, array $query, Navigator $navigator): BeforeRouteBuildEvent
    {
        return new BeforeRouteBuildEvent($route, $query, $navigator, new NavOptions());
    }

    public function testProcessReturnsHandlerResponse(): void
    {
        $navigator = $this->makeNavigator();
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $middleware = $this->makeMiddleware(['lang' => 'en'], $navigator);
        $response = $middleware->process(
            $this->createStub(ServerRequestInterface::class),
            $this->makeHandler()
        );

        $this->assertInstanceOf(ResponseInterface::class, $response);
    }

    public function testMatchingRouteKeepsQueryValueAndAllowsQuery(): void
    {
        $route = $this->makeRoute([KeepUrlQueryMiddleware::class]);
        $navigator = $this->makeNavigator($route);
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $middleware = $this->makeMiddleware(['lang' => 'en'], $navigator);
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());

        $this->assertNotNull($listener);

        $event = $this->makeEvent('home', [], $navigator);
        $listener($event);

        $this->assertSame('en', $event->query['lang']);
        $this->assertContains('lang', $event->options->allowQuery);
    }

    public function testExistingQueryValueIsNotOverridden(): void
    {
        $route = $this->makeRoute([KeepUrlQueryMiddleware::class]);
        $navigator = $this->makeNavigator($route);
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $middleware = $this->makeMiddleware(['lang' => 'en'], $navigator);
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());

        $event = $this->makeEvent('home', ['lang' => 'ja'], $navigator);
        $listener($event);

        $this->assertSame('ja', $event->query['lang']);
    }

    public function testNoMatchingMiddlewareDoesNothing(): void
    {
        $route = $this->makeRoute(['SomeOtherMiddleware']);
        $navigator = $this->makeNavigator($route);
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $middleware = $this->makeMiddleware(['lang' => 'en'], $navigator);
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());

        $event = $this->makeEvent('home', [], $navigator);
        $listener($event);

        $this->assertArrayNotHasKey('lang', $event->query);
    }

    public function testRouteNotFoundDoesNothing(): void
    {
        $navigator = $this->makeNavigator(null);
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $middleware = $this->makeMiddleware(['lang' => 'en'], $navigator);
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());

        $event = $this->makeEvent('missing', [], $navigator);
        $listener($event);

        $this->assertArrayNotHasKey('lang', $event->query);
    }

    public function testMissingInputUsesDefaultValue(): void
    {
        $route = $this->makeRoute([KeepUrlQueryMiddleware::class]);
        $navigator = $this->makeNavigator($route);
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $middleware = $this->makeMiddleware(
            [],
            $navigator,
            ['default' => 'zh']
        );
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());

        $event = $this->makeEvent('home', [], $navigator);
        $listener($event);

        $this->assertSame('zh', $event->query['lang']);
    }

    public function testEmptyValueWithoutDefaultDoesNothing(): void
    {
        $route = $this->makeRoute([KeepUrlQueryMiddleware::class]);
        $navigator = $this->makeNavigator($route);
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $middleware = $this->makeMiddleware([], $navigator);
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());

        $event = $this->makeEvent('home', [], $navigator);
        $listener($event);

        $this->assertArrayNotHasKey('lang', $event->query);
    }

    public function testRouteEnabledFalseSkipsKeeping(): void
    {
        $route = $this->makeRoute([KeepUrlQueryMiddleware::class]);
        $navigator = $this->makeNavigator($route);
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $middleware = $this->makeMiddleware(
            ['lang' => 'en'],
            $navigator,
            ['route_enabled' => false]
        );
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());

        $event = $this->makeEvent('home', [], $navigator);
        $listener($event);

        $this->assertArrayNotHasKey('lang', $event->query);
    }

    public function testRouteEnabledCallableReturningFalseSkipsKeeping(): void
    {
        $route = $this->makeRoute([KeepUrlQueryMiddleware::class]);
        $navigator = $this->makeNavigator($route);
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $middleware = $this->makeMiddleware(
            ['lang' => 'en'],
            $navigator,
            ['route_enabled' => fn() => false]
        );
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());

        $event = $this->makeEvent('home', [], $navigator);
        $listener($event);

        $this->assertArrayNotHasKey('lang', $event->query);
    }

    public function testAfterHookIsCalledWithValue(): void
    {
        $navigator = $this->makeNavigator();
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $called = null;
        $middleware = $this->makeMiddleware(
            ['lang' => 'en'],
            $navigator,
            [
                'after_hook' => function (mixed $value, array $options, $request) use (&$called) {
                    $called = $value;
                },
            ]
        );
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());

        $this->assertSame('en', $called);
    }

    public function testViewHookRegistersBeforeRenderListener(): void
    {
        $navigator = $this->makeNavigator();
        $listener = null;
        $this->captureRouteListener($navigator, $listener);

        $app = $this->createMock(AppContext::class);
        $app->expects($this->once())
            ->method('on')
            ->with(BeforeRenderEvent::class, $this->isInstanceOf(\Closure::class))
            ->willReturnSelf();

        $middleware = new KeepUrlQueryMiddleware(
            $app,
            $this->makeRequest(['lang' => 'en']),
            $navigator,
            'lang',
            '',
            '',
            true,
            null,
            fn() => null,
        );
        $middleware->process($this->createStub(ServerRequestInterface::class), $this->makeHandler());
    }
}

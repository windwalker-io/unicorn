<?php

declare(strict_types=1);

namespace Unicorn\Tests\Component;

use PHPUnit\Framework\Attributes\BeforeClass;
use Unicorn\Tests\TestApp;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Renderer\RendererService;
use Windwalker\DI\Container;
use Windwalker\DI\DIOptions;
use Windwalker\Edge\Component\AbstractComponent;

/**
 * Shared integration-test helper for Unicorn Edge UI components.
 *
 * A component's `data()` method is only half of its contract - the other
 * half is the real `.blade.php` view file it points to via `render()`. Unit
 * testing `data()` alone never notices a renamed view, a broken `@alias`,
 * or an attribute the template forgot to print, so these components should
 * always be exercised through the real app container and the real Edge
 * rendering pipeline instead.
 *
 * This trait boots the app-backed test context (the same one
 * `tests/bootstrap.app.php` + `phpunit.app.xml` prepare) and exposes
 * {@see renderComponent()}, which pushes a configured component instance
 * through the real {@see RendererService}, producing the final HTML string
 * exactly as production code would.
 */
trait ComponentTestTrait
{
    protected static Container $container;

    protected static AppContext $appContext;

    #[BeforeClass(priority: 100)]
    public static function prepareComponentAppContext(): void
    {
        $ctx = TestApp::prepareTestContext();

        static::$container = $ctx->container;
        static::$appContext = $ctx;
    }

    /**
     * Render a configured component instance through the real RendererService
     * and Edge template pipeline - the same path production code uses.
     *
     * @param  array  $extra  Extra view data the component's own `data()` does not
     *                        provide, e.g. `slot` content for the component's body.
     */
    protected static function renderComponent(AbstractComponent $component, array $extra = []): string
    {
        // The test container runs with `lazy = true`; RendererService's own
        // dependencies (e.g. LayoutPathResolver) don't play well with lazy
        // proxies here, so resolve it eagerly.
        $renderer = static::$container->resolve(RendererService::class, options: new DIOptions(lazy: false));

        return trim($renderer->render($component->render(), [...$component->data(), ...$extra]));
    }
}

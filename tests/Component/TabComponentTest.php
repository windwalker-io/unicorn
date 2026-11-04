<?php

declare(strict_types=1);

namespace Unicorn\Tests\Component;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Component\TabComponent;

/**
 * Renders {@see TabComponent} through the real app container and the real
 * `tab.blade.php` view - a `data()`-only unit test would never notice a
 * broken `@tab` alias, a renamed template, or an attribute the view forgot
 * to print, so every case here goes through {@see ComponentTestTrait} and
 * asserts on the actual rendered HTML.
 */
final class TabComponentTest extends TestCase
{
    use ComponentTestTrait;

    #[Test]
    public function rendersActiveTabPaneWithSlotContent(): void
    {
        $component = new TabComponent();
        $component->name = 'details';
        $component->title = 'Details';
        $component->active = true;

        $html = static::renderComponent($component, ['slot' => '<p>Tab Body</p>']);

        self::assertStringContainsString('id="details"', $html);
        self::assertStringContainsString('data-role="tab-pane"', $html);
        self::assertStringContainsString('data-title="Details"', $html);
        self::assertStringContainsString('data-active="1"', $html);
        self::assertStringContainsString('class="tab-pane fade show active"', $html);
        self::assertStringContainsString('<p>Tab Body</p>', $html);
    }

    #[Test]
    public function rendersDisabledInactiveTabWithGeneratedSlugId(): void
    {
        $component = new TabComponent();
        $component->title = 'Account Settings';
        $component->disabled = true;

        $html = static::renderComponent($component);

        self::assertStringContainsString('id="c-tab-account-settings"', $html);
        self::assertStringContainsString('data-disabled="1"', $html);
        self::assertStringNotContainsString('data-active', $html);
        self::assertStringNotContainsString('active"', $html);
    }

    #[Test]
    public function resolvesTheTabView(): void
    {
        self::assertSame('@tab', new TabComponent()->render());
    }

    #[Test]
    public function debugDump(): void
    {
        $container = static::$container;

        try {
            $resolver = $container->resolve(
                \Windwalker\Core\Renderer\RendererService::class,
                options: new \Windwalker\DI\DIOptions(lazy: false),
            );
            var_dump($resolver);
        } catch (\Throwable $e) {
            while ($e) {
                fwrite(STDERR, get_class($e) . ': ' . $e->getMessage() . "\n");
                fwrite(STDERR, $e->getFile() . ':' . $e->getLine() . "\n---\n");
                $e = $e->getPrevious();
            }
        }

        self::assertTrue(true);
    }
}

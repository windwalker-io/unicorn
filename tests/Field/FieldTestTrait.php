<?php

declare(strict_types=1);

namespace Unicorn\Tests\Field;

use PHPUnit\Framework\Attributes\BeforeClass;
use Unicorn\Tests\TestApp;
use Windwalker\Core\Asset\ViteResolver;
use Windwalker\Core\Router\Router;
use Windwalker\DI\Container;
use Windwalker\Form\Field\AbstractField;

/**
 * Shared helper for Unicorn field smoke tests.
 *
 * Fields get their renderer through `#[Inject]`, so they must be created by
 * the app container to render real layouts. Assertions should target the
 * input contract (name, value, checked...) rather than the full markup.
 */
trait FieldTestTrait
{
    protected static Container $container;

    #[BeforeClass(priority: 100)]
    public static function prepareFieldContext(): void
    {
        if (!env('WINDWALKER_TEST_DB_DSN')) {
            self::markTestSkipped('WINDWALKER_TEST_DB_DSN is not set.');
        }

        $container = TestApp::prepareTestContext()->container;

        // Layouts that register scripts resolve the asset service, which needs Vite.
        $container->prepareSharedObject(ViteResolver::class);

        // Edge's `$nav` global resolves the Navigator, which needs a router.
        $container->share(Router::class, new Router());

        static::$container = $container;
    }

    /**
     * @template T of AbstractField
     *
     * @param  class-string<T>  $class
     *
     * @return  T
     */
    protected static function createField(string $class, string $name = 'foo'): AbstractField
    {
        return static::$container->newInstance($class, ['name' => $name]);
    }

    /**
     * Parse rendered field HTML and return the matched elements for an XPath query.
     */
    protected static function query(string $html, string $xpath): \DOMNodeList
    {
        $dom = new \DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8"><body>' . $html . '</body>');

        return new \DOMXPath($dom)->query($xpath);
    }
}

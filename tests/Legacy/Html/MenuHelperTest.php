<?php

declare(strict_types=1);

namespace Unicorn\Tests\Legacy\Html;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Legacy\Html\MenuHelper;
use Windwalker\Core\Http\AppRequest;
use Windwalker\Core\Router\Route;
use Windwalker\Core\Router\SystemUri;

/**
 * The MenuHelperTest class.
 */
#[CoversClass(MenuHelper::class)]
final class MenuHelperTest extends TestCase
{
    /**
     * Build a MenuHelper whose request reports the given matched route and input.
     */
    private function createHelper(
        ?Route $route,
        string $systemRoute = '',
        array $input = [],
    ): MenuHelper {
        $systemUri = new class ($systemRoute) extends SystemUri {
            public function __construct(private string $systemRoute) {}

            public function route(): string
            {
                return $this->systemRoute;
            }
        };

        $request = $this->createStub(AppRequest::class);
        $request->method('getMatchedRoute')->willReturn($route);
        $request->method('getSystemUri')->willReturn($systemUri);
        $request->method('inputWithMethod')->willReturn($input);

        return new MenuHelper($request);
    }

    /**
     * Build a Route mock with the given name and extra values.
     */
    private function createRoute(string $name, array $extra = []): Route
    {
        $route = $this->createStub(Route::class);
        $route->method('getName')->willReturn($name);
        $route->method('getExtraValue')
            ->willReturnCallback(fn(string $key) => $extra[$key] ?? null);

        return $route;
    }

    #[Test]
    public function isActiveReturnsDefaultStringWhenTrue(): void
    {
        $helper = $this->createHelper(null);

        self::assertSame('active', $helper->isActive(true));
        self::assertSame('', $helper->isActive(false));
    }

    #[Test]
    public function isActiveUsesCustomString(): void
    {
        $helper = $this->createHelper(null);

        self::assertSame('current', $helper->isActive(true, 'current'));
        self::assertSame('', $helper->isActive(false, 'current'));
    }

    #[Test]
    public function isActiveFallsBackToPropertyWhenStringIsEmpty(): void
    {
        $helper = $this->createHelper(null);

        self::assertSame('active', $helper->isActive(true, ''));
        self::assertSame('active', $helper->isActive(true, null));
    }

    #[Test]
    public function isReturnsFalseWithoutMatchedRoute(): void
    {
        $helper = $this->createHelper(null);

        self::assertFalse($helper->is('home'));
    }

    #[Test]
    public function isMatchesShortName(): void
    {
        $helper = $this->createHelper($this->createRoute('admin::dashboard'));

        self::assertTrue($helper->is('dashboard'));
        self::assertFalse($helper->is('home'));
    }

    #[Test]
    public function isMatchesFullNamespacedName(): void
    {
        $helper = $this->createHelper($this->createRoute('admin::dashboard'));

        self::assertTrue($helper->is('admin::dashboard'));
        self::assertFalse($helper->is('front::dashboard'));
    }

    #[Test]
    public function isMatchesWildcardAgainstRouteName(): void
    {
        $helper = $this->createHelper($this->createRoute('admin::user.edit'));

        self::assertTrue($helper->is('admin::user.*'));
        self::assertTrue($helper->is('/user.*'));
        self::assertFalse($helper->is('admin::post.*'));
    }

    #[Test]
    public function isMatchesWildcardAgainstSystemUriRoute(): void
    {
        $helper = $this->createHelper(
            $this->createRoute('admin::user.edit'),
            systemRoute: 'post.list',
        );

        self::assertTrue($helper->is('post.*'));
    }

    #[Test]
    public function isMatchesMenuExtraValue(): void
    {
        $route = $this->createRoute(
            'admin::user.edit',
            ['menu' => ['mainmenu' => 'users']],
        );
        $helper = $this->createHelper($route);

        self::assertTrue($helper->is('users'));
        self::assertTrue($helper->is('admin::users'));
        self::assertFalse($helper->is('users', false, 'sidemenu'));
        self::assertFalse($helper->is('posts'));
    }

    #[Test]
    public function isMatchesMenuExtraValueWithCustomMenu(): void
    {
        $route = $this->createRoute(
            'admin::user.edit',
            ['menu' => ['sidemenu' => 'users']],
        );
        $helper = $this->createHelper($route);

        self::assertTrue($helper->is('users', false, 'sidemenu'));
        self::assertFalse($helper->is('users'));
    }

    #[Test]
    public function isMatchesAnyOfArrayPaths(): void
    {
        $helper = $this->createHelper($this->createRoute('admin::dashboard'));

        self::assertTrue($helper->is(['home', 'dashboard']));
        self::assertFalse($helper->is(['home', 'posts']));
    }

    #[Test]
    public function isRespectsQueryWhenMatchingRoute(): void
    {
        $helper = $this->createHelper(
            $this->createRoute('admin::dashboard'),
            input: ['path' => 'a'],
        );

        self::assertTrue($helper->is('dashboard', ['path' => 'a']));
        self::assertFalse($helper->is('dashboard', ['path' => 'b']));
    }

    #[Test]
    public function inGroupMatchesGroupsFromRouteExtra(): void
    {
        $route = $this->createRoute(
            'admin::dashboard',
            ['groups' => ['admin' => true, 'editor' => true]],
        );
        $helper = $this->createHelper($route);

        self::assertTrue($helper->inGroup('admin'));
        self::assertTrue($helper->inGroup(['guest', 'editor']));
        self::assertFalse($helper->inGroup('guest'));
    }

    #[Test]
    public function activeReturnsActiveStringOnMatch(): void
    {
        $helper = $this->createHelper($this->createRoute('admin::dashboard'));

        self::assertSame('active', $helper->active('dashboard'));
        self::assertSame('', $helper->active('home'));
    }

    #[Test]
    public function activeStringCanBeChanged(): void
    {
        $helper = $this->createHelper($this->createRoute('admin::dashboard'));

        $result = $helper->activeString('current');

        self::assertSame($helper, $result);
        self::assertSame('current', $helper->active('dashboard'));
    }

    #[Test]
    public function addPathVarAppendsVariables(): void
    {
        $helper = $this->createHelper(null);

        self::assertSame($helper, $helper->addPathVar('id'));
        $helper->addPathVar(['slug', 'lang']);

        self::assertSame(['path', 'paths', 'id', 'slug', 'lang'], $helper->getPathVars());
    }

    #[Test]
    public function setPathVarsReplacesVariables(): void
    {
        $helper = $this->createHelper(null);

        $helper->setPathVars(['only']);

        self::assertSame(['only'], $helper->getPathVars());
    }

    #[Test]
    public function queryMatchUsesPathVarsFromRequest(): void
    {
        $helper = $this->createHelper(
            $this->createRoute('admin::dashboard'),
            input: ['path' => ['foo', 'bar']],
        );

        self::assertTrue($helper->is('dashboard', ['path' => 'foo/bar']));
    }
}

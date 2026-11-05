<?php

declare(strict_types=1);

namespace Unicorn\Tests\Script;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AbstractScript;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Security\CsrfService;
use Windwalker\Core\Application\PathResolver;
use Windwalker\Language\Language;
use Windwalker\Core\Runtime\Config;
use Windwalker\Core\Router\RouteUri;

final class UnicornScriptTest extends TestCase
{
    private function lang(array $strings): LangService
    {
        $language = new Language('en-GB', 'en-GB');
        $language->addStrings($strings);

        return new LangService(
            new Config([]),
            $this->createStub(PathResolver::class),
            $language
        );
    }

    private function script(
        ?AppContext $app = null,
        ?LangService $lang = null,
        ?Navigator $nav = null,
        ?AssetService $asset = null,
        bool $next = false,
    ): UnicornScript {
        $script = new UnicornScript(
            $app ?? $this->createStub(AppContext::class),
            $lang ?? $this->lang([]),
            $nav ?? $this->createStub(Navigator::class),
        );

        $ref = new \ReflectionProperty(AbstractScript::class, 'asset');
        $ref->setValue($script, $asset ?? $this->createStub(AssetService::class));
        $script->next = $next;

        return $script;
    }

    #[Test]
    public function translateSingleKey(): void
    {
        $script = $this->script(lang: $this->lang(['unicorn.hello' => 'Hello']));

        $this->assertSame($script, $script->translate('unicorn.hello'));
        $this->assertContains('Hello', $script->getData()['unicorn.languages']);
    }

    #[Test]
    public function translateWildcardOnlyMatchesPrefix(): void
    {
        $script = $this->script(lang: $this->lang([
            'unicorn.field.a' => 'A',
            'unicorn.field.b' => 'B',
            'unicorn.other' => 'O',
        ]));

        $script->translate('unicorn.field.*');

        $langs = $script->getData()['unicorn.languages'];
        $this->assertContains('A', $langs);
        $this->assertContains('B', $langs);
        $this->assertNotContains('O', $langs);
    }

    #[Test]
    public function translateArrayTranslatesEachKey(): void
    {
        $script = $this->script(lang: $this->lang(['x.a' => 'A', 'x.b' => 'B']));

        $script->translate(['x.a', 'x.b']);

        $langs = $script->getData()['unicorn.languages'];
        $this->assertCount(2, $langs);
    }

    #[Test]
    public function addRouteUsesGivenUrlAndEnsuresAtPrefix(): void
    {
        $script = $this->script();

        $script->addRoute('foo', '/foo/bar');

        $this->assertSame(['@foo' => '/foo/bar'], $script->getData()['unicorn.routes']);
    }

    #[Test]
    public function addRouteResolvesUrlFromNavigatorWhenNull(): void
    {
        $uri = $this->createStub(RouteUri::class);
        $uri->method('__toString')->willReturn('/resolved');

        $nav = $this->createMock(Navigator::class);
        $nav->expects($this->once())
            ->method('to')
            ->with('foo', ['id' => 1])
            ->willReturn($uri);

        $script = $this->script(nav: $nav);

        $script->addRoute('@foo', ['id' => 1]);

        $this->assertSame(['@foo' => '/resolved'], $script->getData()['unicorn.routes']);
    }

    #[Test]
    public function exposeCsrfTokenStoresToken(): void
    {
        $csrf = $this->createStub(CsrfService::class);
        $csrf->method('getToken')->willReturn('tok');

        $app = $this->createStub(AppContext::class);
        $app->method('service')->willReturn($csrf);

        $script = $this->script(app: $app);
        $script->exposeCsrfToken('my-token');

        $this->assertSame('tok', $script->getData()['my-token']);
    }

    #[Test]
    public function markWithoutSelectorQueuesOnce(): void
    {
        $script = $this->script();

        $script->mark();
        $script->mark();

        $this->assertCount(1, $script->initialise);
        $this->assertSame('u.$ui.mark()', array_values($script->initialise)[0]);
    }

    #[Test]
    public function markWithSelectorQueuesParameters(): void
    {
        $script = $this->script();

        $script->mark('.s', 'kw');

        $this->assertStringContainsString("u.\$ui.mark('.s', 'kw',", array_values($script->initialise)[0]);
    }
}

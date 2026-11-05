<?php

declare(strict_types=1);

namespace Unicorn\Tests\Script;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Script\ModernScript;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AbstractScript;
use Windwalker\Core\Asset\AssetLink;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;

final class ScriptTest extends TestCase
{
    private function inject(AbstractScript $script, AssetService $asset, bool $next = false): void
    {
        $ref = new \ReflectionProperty(AbstractScript::class, 'asset');
        $ref->setValue($script, $asset);

        $script->next = $next;
    }

    private function unicorn(AssetService $asset, bool $next = false): UnicornScript
    {
        $script = new UnicornScript(
            $this->createStub(AppContext::class),
            $this->createStub(LangService::class),
            $this->createStub(Navigator::class),
        );
        $this->inject($script, $asset, $next);

        return $script;
    }

    #[Test]
    public function modernIeLoadsPolyfills(): void
    {
        $asset = $this->createMock(AssetService::class);
        $urls = [];
        $asset->expects($this->exactly(2))
            ->method('js')
            ->willReturnCallback(function (string $url) use (&$urls) {
                $urls[] = $url;

                return $this->createStub(AssetLink::class);
            });

        $script = new ModernScript($this->unicorn($asset));
        $this->inject($script, $asset);

        $this->assertSame($script, $script->ie());
        $this->assertSame(['@core-js', '@current-script-polyfill'], $urls);
    }

    #[Test]
    public function modernWebComponentPolyfillAddsInitialise(): void
    {
        $unicorn = $this->unicorn($this->createStub(AssetService::class));
        $script = new ModernScript($unicorn);

        $this->assertSame($script, $script->webComponentPolyfill());
        $this->assertContains('u.$ui.webComponentPolyfill()', $unicorn->initialise);
    }

    #[Test]
    public function dataMergesByDefault(): void
    {
        $unicorn = $this->unicorn($this->createStub(AssetService::class));

        $unicorn->data('a', ['x' => 1])->data('a', ['y' => 2]);

        $this->assertEqualsCanonicalizing(['x' => 1, 'y' => 2], $unicorn->getData()['a']);
    }

    #[Test]
    public function dataOverridesWhenMergeDisabled(): void
    {
        $unicorn = $this->unicorn($this->createStub(AssetService::class));

        $unicorn->data('a', ['x' => 1])->data('a', ['y' => 2], false);

        $this->assertSame(['a' => ['y' => 2]], $unicorn->getData());
    }

    #[Test]
    public function addInitialiseUsesGivenName(): void
    {
        $unicorn = $this->unicorn($this->createStub(AssetService::class));

        $unicorn->addInitialise('foo()', 'named');
        $unicorn->addInitialise('bar()', 'named');

        $this->assertSame(['named' => 'bar()'], $unicorn->initialise);
    }

    #[Test]
    public function importScriptNextUsesImportModule(): void
    {
        $asset = $this->createMock(AssetService::class);
        $asset->expects($this->once())->method('importModule')->with('foo.js')->willReturnSelf();

        $unicorn = $this->unicorn($asset, true);

        $this->assertSame($unicorn, $unicorn->importScript('foo.js'));
    }

    #[Test]
    public function importScriptAfterMainQueuesInitialise(): void
    {
        $unicorn = $this->unicorn($this->createStub(AssetService::class));

        $unicorn->importScript('foo.js', true);

        $this->assertContains("u.import('foo.js');", $unicorn->initialise);
    }

    #[Test]
    public function importThenNextPassesCodeToImportModule(): void
    {
        $asset = $this->createMock(AssetService::class);
        $asset->expects($this->once())->method('importModule')->with('foo.js', 'run();')->willReturnSelf();

        $this->unicorn($asset, true)->importThen('foo.js', 'run();');
    }

    #[Test]
    public function importThenLegacyAfterMainWrapsWithU(): void
    {
        $unicorn = $this->unicorn($this->createStub(AssetService::class));

        $unicorn->importThen('foo.js', 'run();', true);

        $js = array_values($unicorn->initialise)[0];
        $this->assertStringContainsString("u.import('foo.js').then(function (module) {", $js);
        $this->assertStringContainsString('run();', $js);
    }
}

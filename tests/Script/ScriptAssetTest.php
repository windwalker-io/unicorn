<?php

declare(strict_types=1);

namespace Unicorn\Tests\Script;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Script\BootstrapScript;
use Unicorn\Script\EditorScript;
use Unicorn\Script\JQueryScript;
use Unicorn\Script\UnicornScript;
use Unicorn\Script\VueScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AbstractScript;
use Windwalker\Core\Asset\AssetLink;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Core\Security\CsrfService;

final class ScriptAssetTest extends TestCase
{
    private function withAsset(AbstractScript $script, AssetService $asset, bool $next = false): void
    {
        $ref = new \ReflectionProperty(AbstractScript::class, 'asset');
        $ref->setValue($script, $asset);
        $script->next = $next;
    }

    /**
     * @param  list<string>  $urls
     */
    private function expectJs(array $urls, string $method = 'js'): AssetService
    {
        $asset = $this->createMock(AssetService::class);
        $i = 0;
        $asset->expects($this->exactly(count($urls)))
            ->method($method)
            ->willReturnCallback(function (string $url) use (&$i, $urls) {
                $this->assertSame($urls[$i++], $url);

                return $this->createStub(AssetLink::class);
            });

        return $asset;
    }

    #[Test]
    public function jqueryLoadsOnce(): void
    {
        $script = new JQueryScript();
        $this->withAsset($script, $this->expectJs(['vendor/jquery/dist/jquery.min.js']));

        $this->assertSame($script, $script->jquery());
        $script->jquery();
    }

    #[Test]
    public function jquerySlimLoadsSlimBuild(): void
    {
        $script = new JQueryScript();
        $this->withAsset($script, $this->expectJs(['vendor/jquery/dist/jquery.slim.min.js']));

        $script->slim();
    }

    #[Test]
    public function vueSelectsVersion(): void
    {
        $script = new VueScript();
        $this->withAsset($script, $this->expectJs(['vendor/vue/dist/vue.min.js', '@vue']));

        $script->vue(2);
        $script->vue();
    }

    #[Test]
    public function vueDraggableLoadsBothScriptsOnce(): void
    {
        $script = new VueScript();
        $this->withAsset($script, $this->expectJs(['@sortablejs', '@vuedraggable']));

        $script->draggable();
        $script->draggable();
    }

    #[Test]
    public function vueAnimateDependsOnNext(): void
    {
        $legacy = new VueScript();
        $this->withAsset($legacy, $this->expectJs(['@vue2-animate'], 'css'));
        $legacy->animate();

        $next = new VueScript();
        $this->withAsset($next, $this->expectJs(['@vue-animate'], 'css'), true);
        $next->animate();
    }

    #[Test]
    public function editorTinymceQueuesInit(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())
            ->method('importMainThen')
            ->with($this->stringContains("u.\$ui.tinymce.init('#ed',"));

        $script = new EditorScript($unicorn);
        $this->withAsset($script, $this->createStub(AssetService::class));

        $script->tinymce('#ed');
        $script->tinymce('#ed');
    }

    #[Test]
    public function bootstrapKeepTabJsonEncodesSelector(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())
            ->method('importMainThen')
            ->with($this->stringContains('u.$ui.bootstrap.keepTab("#tabs",'));

        $script = new BootstrapScript($unicorn);
        $this->withAsset($script, $this->createStub(AssetService::class));

        $script->keepTab('#tabs');
    }

    #[Test]
    public function bootstrapMultiLevelMenuDependsOnNext(): void
    {
        $script = new BootstrapScript($this->createStub(UnicornScript::class));
        $this->withAsset($script, $this->expectJs(['@unicorn/multi-level-menu.css'], 'css'), true);

        $script->multiLevelMenu();
    }

    #[Test]
    public function bootstrapBs4AdapterLoadsCss(): void
    {
        $script = new BootstrapScript($this->createStub(UnicornScript::class));
        $this->withAsset($script, $this->expectJs(['@unicorn/bootstrap/bs4-adapter.min.css'], 'css'));

        $script->bs4Adapter();
    }

    private function unicornWith(AssetService $asset, bool $next): UnicornScript
    {
        $csrf = $this->createStub(CsrfService::class);
        $csrf->method('getToken')->willReturn('tok');

        $systemUri = $this->createStub(SystemUri::class);
        $systemUri->method('all')->willReturn(['host' => 'h']);

        $app = $this->createStub(AppContext::class);
        $app->method('getSystemUri')->willReturn($systemUri);
        $app->method('service')->willReturn($csrf);

        $language = new \Windwalker\Language\Language('en-GB', 'en-GB');
        $lang = new LangService(new \Windwalker\Core\Runtime\Config([]), $this->createStub(\Windwalker\Core\Application\PathResolver::class), $language);

        $script = new UnicornScript($app, $lang, $this->createStub(Navigator::class));
        $this->withAsset($script, $asset, $next);

        return $script;
    }

    #[Test]
    public function initLegacyRegistersMainImportMap(): void
    {
        $asset = $this->createMock(AssetService::class);
        $asset->expects($this->once())->method('importMap')->with('@main', 'main.js')->willReturnSelf();

        $script = $this->unicornWith($asset, false);
        $script->init('main.js');

        $this->assertTrue($script->importMain);
        $this->assertSame('tok', $script->getData()['csrf-token']);
        $this->assertSame('h', $script->getData()['unicorn.uri']['host']);
    }

    #[Test]
    public function initNextRegistersUnicornImportMaps(): void
    {
        $names = [];
        $asset = $this->createMock(AssetService::class);
        $asset->method('handleUri')->willReturnArgument(0);
        $asset->expects($this->exactly(3))
            ->method('importMap')
            ->willReturnCallback(function (string $name) use (&$names, $asset) {
                $names[] = $name;

                return $asset;
            });

        $script = $this->unicornWith($asset, true);
        $script->init();

        $this->assertSame(['@windwalker-io/unicorn', '@windwalker-io/unicorn/', '@unicorn/'], $names);
        $this->assertTrue($script->importMain);
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Tests\Script;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Script\BootstrapScript;
use Unicorn\Script\FormScript;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Asset\AbstractScript;
use Windwalker\Core\Asset\AssetService;

/**
 * Verifies that asset URIs registered in "next" mode resolve to real files
 * inside the @windwalker-io/unicorn-next package (assets/dist).
 */
final class NextAssetPathTest extends TestCase
{
    private const NEXT_PACKAGE = '@windwalker-io/unicorn-next';

    private string $assetsRoot;

    protected function setUp(): void
    {
        $this->assetsRoot = dirname(__DIR__, 2) . '/assets';

        if (!is_dir($this->assetsRoot . '/dist')) {
            $this->markTestSkipped('unicorn-next dist is not built.');
        }
    }

    #[Test]
    public function npmPackageNameMatchesImportMapTarget(): void
    {
        $package = json_decode(file_get_contents($this->assetsRoot . '/package.json'), true);

        $this->assertSame(self::NEXT_PACKAGE, $package['name']);

        $source = file_get_contents(dirname(__DIR__, 2) . '/src/UnicornPackage.php');

        $this->assertStringContainsString(self::NEXT_PACKAGE, $source);
        $this->assertStringContainsString('"vendor/$unicornPackage/dist/"', $source);
        $this->assertStringContainsString('"vendor/$unicornPackage/dist/unicorn.js"', $source);
    }

    #[Test]
    public function mainEntryExists(): void
    {
        $package = json_decode(file_get_contents($this->assetsRoot . '/package.json'), true);

        $this->assertFileExists($this->assetsRoot . '/' . $package['main']);
        $this->assertFileExists($this->assetsRoot . '/dist/unicorn.js');
    }

    #[Test]
    public function unicornScriptHardCodedPathsExist(): void
    {
        $source = file_get_contents(dirname(__DIR__, 2) . '/src/Script/UnicornScript.php');

        preg_match_all(
            '#vendor/' . preg_quote(self::NEXT_PACKAGE, '#') . '/([^\'"]*)#',
            $source,
            $matches
        );

        $this->assertNotEmpty($matches[1]);

        foreach (array_unique($matches[1]) as $path) {
            $this->assertFileExists(
                $this->assetsRoot . '/' . rtrim($path, '/'),
                "UnicornScript references missing path: $path"
            );
        }
    }

    #[Test]
    public function nextModeScriptsRegisterExistingFiles(): void
    {
        $uris = [];

        $asset = $this->createStub(AssetService::class);
        $record = function (string $uri) use (&$uris, $asset) {
            $uris[] = $uri;

            return $this->createStub(\Windwalker\Core\Asset\AssetLink::class);
        };
        $asset->method('css')->willReturnCallback($record);
        $asset->method('js')->willReturnCallback($record);

        $ref = new \ReflectionProperty(AbstractScript::class, 'asset');

        $bootstrap = new BootstrapScript($this->createStub(UnicornScript::class));
        $form = new FormScript(
            $this->createStub(UnicornScript::class),
            $this->createStub(\Windwalker\Core\Router\SystemUri::class),
            $this->createStub(\Unicorn\Script\VueScript::class),
        );

        foreach ([$bootstrap, $form] as $script) {
            $ref->setValue($script, $asset);
            $script->next = true;
        }

        $bootstrap->multiLevelMenu();
        $form->switcher();

        $this->assertSame(
            ['@unicorn/multi-level-menu.css', '@unicorn/switcher.css'],
            $uris
        );

        foreach ($uris as $uri) {
            $this->assertStringStartsWith('@unicorn/', $uri);

            $this->assertFileExists(
                $this->assetsRoot . '/dist/' . substr($uri, strlen('@unicorn/')),
                "Missing file for $uri"
            );
        }
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Tests\Script;

use Aws\MockHandler;
use Aws\S3\S3Client;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mime\MimeTypes;
use Unicorn\Aws\S3Service;
use Unicorn\Script\AwsScript;
use Unicorn\Script\FormScript;
use Unicorn\Script\UnicornScript;
use Unicorn\Script\VueScript;
use Unicorn\Storage\Adapter\S3Storage;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AbstractScript;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Asset\ViteResolver;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\DI\Container;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Form\Form;

final class ScriptIntegrationTest extends TestCase
{
    private function setAsset(AbstractScript $script, AssetService $asset, bool $next = false): void
    {
        $ref = new \ReflectionProperty(AbstractScript::class, 'asset');
        $ref->setValue($script, $asset);
        $script->next = $next;
    }

    private function s3Service(): S3Service
    {
        $client = new S3Client([
            'credentials' => ['key' => 'test-key', 'secret' => 'test-secret'],
            'region' => 'us-east-1',
            'version' => 'latest',
            'handler' => new MockHandler(),
        ]);

        return new S3Service($client, ['bucket' => 'test-bucket', 'subfolder' => 'sub']);
    }

    #[Test]
    public function awsS3BrowserUploaderBuildsUploaderData(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())
            ->method('importMainThen')
            ->with($this->logicalAnd(
                $this->stringContains("u.data('@s3.uploader.up',"),
                $this->stringContains('test-bucket'),
                $this->stringContains('sub'),
                $this->stringContains('x-amz-signature'),
            ));

        $script = new AwsScript($unicorn, $this->createStub(Container::class));
        $this->setAsset($script, $this->createStub(AssetService::class));

        $script->s3BrowserUploader('up', S3Service::ACL_PUBLIC_READ, ['s3Service' => $this->s3Service()]);
    }

    #[Test]
    public function awsS3BrowserUploaderResolvesStorageByProfile(): void
    {
        $storage = new S3Storage($this->s3Service(), new MimeTypes());

        $container = $this->createMock(Container::class);
        $container->expects($this->once())->method('get')->willReturn($storage);

        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())->method('importMainThen');

        $script = new AwsScript($unicorn, $container);
        $this->setAsset($script, $this->createStub(AssetService::class));

        $script->s3BrowserUploader('up2');
    }

    #[Test]
    public function awsS3BrowserUploaderRunsOncePerName(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())->method('importMainThen');

        $script = new AwsScript($unicorn, $this->createStub(Container::class));
        $this->setAsset($script, $this->createStub(AssetService::class));

        $script->s3BrowserUploader('same', S3Service::ACL_PUBLIC_READ, ['s3Service' => $this->s3Service()]);
        $script->s3BrowserUploader('same', S3Service::ACL_PUBLIC_READ, ['s3Service' => $this->s3Service()]);
    }

    private function unicornWithVite(?array $cssEntries): UnicornScript
    {
        $vite = $this->createStub(ViteResolver::class);
        $vite->method('resolveUriCssEntries')->willReturn($cssEntries ?? []);

        $asset = $this->createMock(AssetService::class);
        $ref = new \ReflectionProperty(AssetService::class, 'vite');
        $ref->setValue($asset, $vite);
        $asset->method('handleUri')->willReturnArgument(0);
        $asset->method('appendVersion')->willReturnCallback(fn(string $u) => $u . '?v=1');
        $asset->expects($this->exactly(4))->method('importMap')->willReturnSelf();
        $asset->expects($this->exactly(count($cssEntries ?? [])))->method('css');

        $systemUri = $this->createStub(SystemUri::class);
        $systemUri->method('all')->willReturn([]);
        $app = $this->createStub(AppContext::class);
        $app->method('getSystemUri')->willReturn($systemUri);
        $app->method('service')->willReturn(
            $this->createStub(\Windwalker\Core\Security\CsrfService::class)
        );

        $lang = new LangService(
            new \Windwalker\Core\Runtime\Config([]),
            $this->createStub(\Windwalker\Core\Application\PathResolver::class),
            new \Windwalker\Language\Language('en-GB', 'en-GB')
        );

        $script = new UnicornScript($app, $lang, $this->createStub(Navigator::class));
        $this->setAsset($script, $asset, true);

        return $script;
    }

    #[Test]
    public function initNextWithMainJsRegistersMainAndCssEntries(): void
    {
        $script = $this->unicornWithVite(['a.css', 'b.css']);

        $script->init('main.js');

        $this->assertTrue($script->importMain);
    }

    private function form(): FormScript
    {
        $script = new FormScript(
            $this->createStub(UnicornScript::class),
            $this->createStub(SystemUri::class),
            $this->createStub(VueScript::class),
        );
        $this->setAsset($script, $this->createStub(AssetService::class));

        return $script;
    }

    #[Test]
    public function formShowOnSetsWrapperAttrAndInitsOnce(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())->method('importMainThen')->with('u.$ui.initShowOn();');

        $script = new FormScript($unicorn, $this->createStub(SystemUri::class), $this->createStub(VueScript::class));
        $this->setAsset($script, $this->createStub(AssetService::class));

        $target = $this->createStub(AbstractField::class);
        $target->method('getId')->willReturn('input-target');

        $form = $this->createStub(Form::class);
        $form->method('getField')->willReturn($target);

        $field = $this->createMock(AbstractField::class);
        $field->method('get')->willReturn(['target' => '1']);
        $field->method('getForm')->willReturn($form);
        $field->expects($this->once())
            ->method('wrapperAttr')
            ->with('uni-show-on', json_encode(['#input-target' => '1']));

        $script->showOn($field);
    }

    #[Test]
    public function formShowOnThrowsWhenTargetMissing(): void
    {
        $form = $this->createStub(Form::class);
        $form->method('getField')->willReturn(null);

        $field = $this->createStub(AbstractField::class);
        $field->method('get')->willReturn(['missing' => '1']);
        $field->method('getForm')->willReturn($form);

        $this->expectException(\UnexpectedValueException::class);

        $this->form()->showOn($field);
    }

    #[Test]
    public function formFlatpickrLocaleReturnsLocaleWhenFileExists(): void
    {
        $file = tempnam(sys_get_temp_dir(), 'fp');

        try {
            $asset = $this->createStub(AssetService::class);
            $asset->method('addSysPath')->willReturn($file);

            $lang = new LangService(
                new \Windwalker\Core\Runtime\Config([]),
                $this->createStub(\Windwalker\Core\Application\PathResolver::class),
                new \Windwalker\Language\Language('zh-TW', 'en-GB')
            );

            $script = $this->form();
            $this->setAsset($script, $asset);
            new \ReflectionProperty($script, 'lang')->setValue($script, $lang);

            $this->assertSame('zh-tw', $script->flatpickrLocale());
        } finally {
            unlink($file);
        }
    }

    #[Test]
    public function formFlatpickrLocaleFallsBackToLanguagePrefix(): void
    {
        $file = tempnam(sys_get_temp_dir(), 'fp');

        try {
            $asset = $this->createStub(AssetService::class);
            $asset->method('addSysPath')->willReturnCallback(
                fn(string $path) => str_ends_with($path, '/zh.js') ? $file : '/not-exists.js'
            );

            $lang = new LangService(
                new \Windwalker\Core\Runtime\Config([]),
                $this->createStub(\Windwalker\Core\Application\PathResolver::class),
                new \Windwalker\Language\Language('zh-TW', 'en-GB')
            );

            $script = $this->form();
            $this->setAsset($script, $asset);
            new \ReflectionProperty($script, 'lang')->setValue($script, $lang);

            $this->assertSame('zh', $script->flatpickrLocale());
        } finally {
            unlink($file);
        }
    }

    #[Test]
    public function formFlatpickrLocaleReturnsNullWhenNoFile(): void
    {
        $asset = $this->createStub(AssetService::class);
        $asset->method('addSysPath')->willReturn(sys_get_temp_dir() . '/not-exists-' . uniqid() . '.js');

        $lang = new LangService(
            new \Windwalker\Core\Runtime\Config([]),
            $this->createStub(\Windwalker\Core\Application\PathResolver::class),
            new \Windwalker\Language\Language('zh-TW', 'en-GB')
        );

        $script = $this->form();
        $this->setAsset($script, $asset);
        new \ReflectionProperty($script, 'lang')->setValue($script, $lang);

        $this->assertNull($script->flatpickrLocale());
    }

    #[Test]
    public function formShowOnIgnoresFieldWithoutShowOn(): void
    {
        $field = $this->createMock(AbstractField::class);
        $field->method('get')->willReturn(null);
        $field->expects($this->never())->method('wrapperAttr');

        $this->form()->showOn($field);
    }
}

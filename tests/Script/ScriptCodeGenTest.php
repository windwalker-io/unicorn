<?php

declare(strict_types=1);

namespace Unicorn\Tests\Script;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Aws\S3Service;
use Unicorn\Script\AwsScript;
use Unicorn\Script\BootstrapScript;
use Unicorn\Script\FormScript;
use Unicorn\Script\UnicornScript;
use Unicorn\Script\VueScript;
use Unicorn\Storage\StorageInterface;
use Windwalker\Core\Asset\AbstractScript;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Router\SystemUri;
use Windwalker\DI\Container;

final class ScriptCodeGenTest extends TestCase
{
    private function setAsset(AbstractScript $script, bool $next = false): void
    {
        $ref = new \ReflectionProperty(AbstractScript::class, 'asset');
        $ref->setValue($script, $this->createStub(AssetService::class));
        $script->next = $next;
    }

    #[Test]
    public function bootstrapPopoverQueuesCodeOnce(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())
            ->method('importMainThen')
            ->with($this->stringContains("u.\$ui.bootstrap.popover('.pop',"));

        $script = new BootstrapScript($unicorn);

        $this->assertSame($script, $script->popover('.pop'));
        $script->popover('.pop');
    }

    #[Test]
    public function bootstrapSameMethodDifferentSelectorsBothRun(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->exactly(2))->method('importMainThen');

        $script = new BootstrapScript($unicorn);
        $script->tooltip('.a');
        $script->tooltip('.b');
    }

    private function form(UnicornScript $unicorn): FormScript
    {
        $script = new FormScript(
            $unicorn,
            $this->createStub(SystemUri::class),
            $this->createStub(VueScript::class),
        );
        $this->setAsset($script);

        return $script;
    }

    #[Test]
    public function formChoicesThrowsOnNext(): void
    {
        $script = $this->form($this->createStub(UnicornScript::class));
        $script->next = true;

        $this->expectException(\LogicException::class);

        $script->choices('.x');
    }

    #[Test]
    public function formFlatpickrQueuesOnce(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())->method('importMainThen')->with('u.$ui.flatpickr()');

        $script = $this->form($unicorn);
        $script->flatpickr();
        $script->flatpickr();
    }

    #[Test]
    public function formCascadeSelectNextQueuesMainCode(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())->method('importMainThen')->with('u.$ui.cascadeSelect()');

        $script = $this->form($unicorn);
        $script->next = true;
        $script->cascadeSelect();
    }

    #[Test]
    public function formFileDragTranslatesThenQueues(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())->method('translate')->with('unicorn.field.file.drag.*');
        $unicorn->expects($this->once())->method('importMainThen')->with('u.$ui.fileDrag()');

        $this->form($unicorn)->fileDrag();
    }

    #[Test]
    public function formListDependentUsesAjaxUrlForStringSource(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())
            ->method('importMainThen')
            ->with($this->logicalAnd(
                $this->stringContains("u.\$ui.listDependent('#a', '#b',"),
                $this->stringContains('"\/api\/list"'),
            ));

        $this->form($unicorn)->listDependent('#a', '#b', '/api/list');
    }

    #[Test]
    public function formModalFieldLegacyDefinesWindowCallback(): void
    {
        $unicorn = $this->createMock(UnicornScript::class);
        $unicorn->expects($this->once())
            ->method('importMainThen')
            ->with($this->stringContains("window.cb = u.\$modalField.createCallback('t', '#s', '#m')"));

        $this->form($unicorn)->modalField('t', '#s', '#m', 'cb');
    }

    #[Test]
    public function awsS3BrowserUploaderRejectsNonS3Storage(): void
    {
        $container = $this->createStub(Container::class);
        $container->method('get')->willReturn($this->createStub(StorageInterface::class));

        $script = new AwsScript($this->createStub(UnicornScript::class), $container);
        $this->setAsset($script);

        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('must be S3Storage');

        $script->s3BrowserUploader('up', S3Service::ACL_PUBLIC_READ);
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use GuzzleHttp\Psr7\Utils;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mime\MimeTypes;
use Unicorn\Upload\FileUploadService;
use Unicorn\Upload\ImageRedrawProcessor;
use Windwalker\DI\Container;

/**
 * Tests for FileUploadService::optimizeImage() when optimization is enabled.
 */
class FileUploadServiceOptimizeTest extends TestCase
{
    private string $tmpDir;

    protected function setUp(): void
    {
        $this->tmpDir = sys_get_temp_dir() . '/unicorn-optimize-' . uniqid() . '/';
        mkdir($this->tmpDir);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->tmpDir . '*') ?: [] as $file) {
            @unlink($file);
        }

        @rmdir($this->tmpDir);
    }

    private function createService(array $options): FileUploadService
    {
        $container = new Container();

        return new FileUploadService($container, new ImageRedrawProcessor($this->tmpDir), $options, MimeTypes::getDefault());
    }

    #[Test]
    #[TestDox('optimizeImage() runs the optimizer and returns a readable image stream')]
    public function optimizesWhenEnabled(): void
    {
        if (!class_exists(\Spatie\ImageOptimizer\OptimizerChainFactory::class)) {
            self::markTestSkipped('spatie/image-optimizer is not installed.');
        }

        $gd = imagecreatetruecolor(6, 6);
        ob_start();
        imagepng($gd);
        $png = (string) ob_get_clean();

        $service = $this->createService(['optimize' => true]);

        $result = $service->optimizeImage(Utils::streamFor($png), 'a.png', ['stripExif' => false]);

        $result->rewind();
        $bytes = $result->getContents();

        self::assertSame("\x89PNG", substr($bytes, 0, 4));
        self::assertNotSame('', $bytes);
    }
}

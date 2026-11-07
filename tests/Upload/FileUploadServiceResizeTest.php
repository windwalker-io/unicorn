<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use GuzzleHttp\Psr7\Utils;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mime\MimeTypes;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\ImageManager;
use Unicorn\Image\Decoder\PsrStreamGdDecoder;
use Unicorn\Upload\FileUploadService;
use Unicorn\Upload\ImageRedrawProcessor;
use Unicorn\Upload\ResizeConfig;
use Windwalker\DI\Container;

/**
 * Tests for FileUploadService image resizing and optimization.
 */
class FileUploadServiceResizeTest extends TestCase
{
    private static string $pngPath;

    public static function setUpBeforeClass(): void
    {
        self::$pngPath = sys_get_temp_dir() . '/unicorn-resize-' . uniqid() . '.png';

        $gd = imagecreatetruecolor(8, 4);
        imagepng($gd, self::$pngPath);
    }

    public static function tearDownAfterClass(): void
    {
        @unlink(self::$pngPath);
    }

    private function createService(array $options = []): FileUploadService
    {
        $container = new Container();

        return new FileUploadService($container, new ImageRedrawProcessor(sys_get_temp_dir()), $options, MimeTypes::getDefault());
    }

    private function readSize(\Psr\Http\Message\StreamInterface $stream): array
    {
        $image = ImageManager::usingDriver(GdDriver::class)->decode($stream, PsrStreamGdDecoder::class);

        return [$image->width(), $image->height()];
    }

    #[Test]
    #[TestDox('resizeImage() scales down to the requested width and keeps the aspect ratio')]
    public function scalesDownToWidth(): void
    {
        $service = $this->createService();

        $stream = $service->resizeImage(self::$pngPath, ['width' => 4]);

        self::assertSame([4, 2], $this->readSize($stream));
    }

    #[Test]
    #[TestDox('resizeImage() never enlarges an image smaller than the target')]
    public function doesNotEnlarge(): void
    {
        $service = $this->createService();

        $stream = $service->resizeImage(self::$pngPath, ['width' => 100]);

        self::assertSame([8, 4], $this->readSize($stream));
    }

    #[Test]
    #[TestDox('resizeImage() with crop fills the exact width and height')]
    public function cropsToExactSize(): void
    {
        $service = $this->createService();

        $stream = $service->resizeImage(self::$pngPath, ['width' => 4, 'height' => 4, 'crop' => true]);

        self::assertSame([4, 4], $this->readSize($stream));
    }

    #[Test]
    #[TestDox('resizeImage() re-encodes without resizing when resize is disabled')]
    public function reencodesWhenDisabled(): void
    {
        $service = $this->createService();

        $stream = $service->resizeImage(self::$pngPath, ['enabled' => false, 'outputFormat' => 'png']);

        $stream->rewind();
        self::assertSame("\x89PNG", substr($stream->getContents(), 0, 4));
        $stream->rewind();
        self::assertSame([8, 4], $this->readSize($stream));
    }

    #[Test]
    #[TestDox('resizeImage() accepts a PSR-7 stream as the source')]
    public function acceptsStreamSource(): void
    {
        $service = $this->createService();

        $stream = $service->resizeImage(Utils::streamFor(file_get_contents(self::$pngPath)), ['width' => 2]);

        self::assertSame([2, 1], $this->readSize($stream));
    }

    #[Test]
    #[TestDox('resizeImage() accepts an SplFileInfo as the source')]
    public function acceptsSplFileInfoSource(): void
    {
        $service = $this->createService();

        $stream = $service->resizeImage(new \SplFileInfo(self::$pngPath), ['width' => 2]);

        self::assertSame([2, 1], $this->readSize($stream));
    }

    #[Test]
    #[TestDox('optimizeImage() returns the source unchanged when optimize is disabled')]
    public function optimizeReturnsSourceWhenDisabled(): void
    {
        $service = $this->createService(['optimize' => false]);
        $src = Utils::streamFor('image-bytes');

        $result = $service->optimizeImage($src, 'a.png', new ResizeConfig(stripExif: false));

        self::assertSame($src, $result);
    }

    #[Test]
    #[TestDox('Resize options passed as ResizeConfig override the service default config')]
    public function resizeConfigOverridesDefaults(): void
    {
        $service = $this->createService(['resize' => ['width' => 8]]);

        $stream = $service->resizeImage(self::$pngPath, new ResizeConfig(width: 2));

        self::assertSame([2, 1], $this->readSize($stream));
    }

    #[Test]
    #[TestDox('resizeImage() writes an interlaced PNG when interlaced is enabled')]
    public function interlacedPng(): void
    {
        $service = $this->createService();

        $stream = $service->resizeImage(self::$pngPath, new ResizeConfig(outputFormat: 'png', interlaced: true));

        $stream->rewind();
        // IHDR interlace method byte: 0 = none, 1 = Adam7.
        self::assertSame(1, ord($stream->getContents()[28]));
    }

    #[Test]
    #[TestDox('resizeImage() writes a non-interlaced PNG by default')]
    public function nonInterlacedPngByDefault(): void
    {
        $service = $this->createService();

        $stream = $service->resizeImage(self::$pngPath, new ResizeConfig(outputFormat: 'png'));

        $stream->rewind();
        self::assertSame(0, ord($stream->getContents()[28]));
    }

    #[Test]
    #[TestDox('resizeImage() ignores interlaced for formats that do not support it')]
    public function interlacedIgnoredForJpeg(): void
    {
        $service = $this->createService();

        $stream = $service->resizeImage(self::$pngPath, new ResizeConfig(outputFormat: 'jpg', interlaced: true));

        $stream->rewind();
        self::assertSame("\xFF\xD8", substr($stream->getContents(), 0, 2));
    }
}

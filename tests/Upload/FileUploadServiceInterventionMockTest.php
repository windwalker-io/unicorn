<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use GuzzleHttp\Psr7\Utils;
use Intervention\Image\Interfaces\EncodedImageInterface;
use Intervention\Image\Interfaces\ImageInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\StreamInterface;
use Symfony\Component\Mime\MimeTypes;
use Unicorn\Tests\Support\Intervention\V2Core;
use Unicorn\Tests\Support\Intervention\V2Image;
use Unicorn\Upload\FileUploadService;
use Windwalker\DI\Container;

/**
 * Verifies the exact Intervention v2 and v3 calls made by FileUploadService resizing, using mocks.
 * No real image processing happens, so this does not depend on the Intervention version installed.
 */
class FileUploadServiceInterventionMockTest extends TestCase
{
    protected function setUp(): void
    {
        SpyUploadService::reset();
    }

    private function createService(array $options = []): FileUploadService
    {
        return new SpyUploadService(new Container(), $options, MimeTypes::getDefault());
    }

    /**
     * Source passed to resizeImage(). A stream is used so no file has to exist on disk.
     */
    private function source(): StreamInterface
    {
        return Utils::streamFor('source-bytes');
    }

    /**
     * A v3 image mock whose encode chain returns the given bytes. Encode calls are recorded.
     *
     * @param  array  $encodeCalls  Filled with [extension, options] for each encodeByExtension() call.
     */
    private function createV3Image(array &$encodeCalls, string $bytes = 'ENCODED-V3'): MockObject&ImageInterface
    {
        $fp = fopen('php://memory', 'r+');
        fwrite($fp, $bytes);
        rewind($fp);

        $encoded = $this->createStub(EncodedImageInterface::class);
        $encoded->method('toFilePointer')->willReturn($fp);

        $image = $this->createMock(ImageInterface::class);
        $image->method('encodeByExtension')->willReturnCallback(
            function (?string $extension = null, mixed ...$options) use (&$encodeCalls, $encoded) {
                $encodeCalls[] = [$extension, $options];

                return $encoded;
            }
        );

        return $image;
    }

    private function bytesOf(StreamInterface $stream): string
    {
        $stream->rewind();

        return $stream->getContents();
    }

    private function callableConstraint(): \PHPUnit\Framework\Constraint\Constraint
    {
        return self::callback(static fn(mixed $c): bool => is_callable($c));
    }

    /**
     * A v2 image mock with 8x4 dimensions. Fluent methods are configured by each test.
     */
    private function createV2Image(): MockObject&V2Image
    {
        $image = $this->createMock(V2Image::class);
        $image->method('width')->willReturn(8);
        $image->method('height')->willReturn(4);

        return $image;
    }

    #[Test]
    #[TestDox('v3: a width-only resize calls scaleDown() with the width and no height')]
    public function v3WidthOnlyScalesDown(): void
    {
        $encodeCalls = [];
        $image = $this->createV3Image($encodeCalls);
        $image->expects(self::once())->method('scaleDown')->with(4, null)->willReturnSelf();
        $image->expects(self::never())->method('coverDown');

        SpyUploadService::$version = 3;
        SpyUploadService::$image = $image;

        $result = $this->createService()->resizeImage($this->source(), ['width' => 4]);

        self::assertSame('ENCODED-V3', $this->bytesOf($result));
        self::assertSame([['jpg', ['quality' => 90]]], $encodeCalls);
    }

    #[Test]
    #[TestDox('v3: crop with width and height calls coverDown() and not scaleDown()')]
    public function v3CropCallsCoverDown(): void
    {
        $encodeCalls = [];
        $image = $this->createV3Image($encodeCalls);
        $image->expects(self::once())->method('coverDown')->with(4, 4)->willReturnSelf();
        $image->expects(self::never())->method('scaleDown');

        SpyUploadService::$version = 3;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['width' => 4, 'height' => 4, 'crop' => true]);
    }

    #[Test]
    #[TestDox('v3: width and height without crop calls scaleDown() with both dimensions')]
    public function v3WidthAndHeightScaleDown(): void
    {
        $encodeCalls = [];
        $image = $this->createV3Image($encodeCalls);
        $image->expects(self::once())->method('scaleDown')->with(4, 2)->willReturnSelf();
        $image->expects(self::never())->method('coverDown');

        SpyUploadService::$version = 3;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['width' => 4, 'height' => 2]);
    }

    #[Test]
    #[TestDox('v3: without dimensions neither scaleDown() nor coverDown() is called, but the image is still encoded')]
    public function v3NoDimensionsOnlyEncodes(): void
    {
        $encodeCalls = [];
        $image = $this->createV3Image($encodeCalls);
        $image->expects(self::never())->method('scaleDown');
        $image->expects(self::never())->method('coverDown');

        SpyUploadService::$version = 3;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['outputFormat' => 'webp']);

        self::assertCount(1, $encodeCalls);
    }

    #[Test]
    #[TestDox('v3: disabled resize re-encodes the image without any transform, PNG gets no quality option')]
    public function v3DisabledReencodesOnly(): void
    {
        $encodeCalls = [];
        $image = $this->createV3Image($encodeCalls);
        $image->expects(self::never())->method('scaleDown');
        $image->expects(self::never())->method('coverDown');

        SpyUploadService::$version = 3;
        SpyUploadService::$image = $image;

        $result = $this->createService()->resizeImage(
            $this->source(),
            ['enabled' => false, 'outputFormat' => 'png']
        );

        self::assertSame([['png', []]], $encodeCalls);
        self::assertSame('ENCODED-V3', $this->bytesOf($result));
    }

    #[Test]
    #[TestDox('v3: the configured quality is passed to encodeByExtension() for lossy formats')]
    public function v3PassesQuality(): void
    {
        $encodeCalls = [];
        $image = $this->createV3Image($encodeCalls);
        $image->expects(self::once())->method('scaleDown')->willReturnSelf();

        SpyUploadService::$version = 3;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage(
            $this->source(),
            ['width' => 4, 'quality' => 70, 'outputFormat' => 'jpg']
        );

        self::assertSame([['jpg', ['quality' => 70]]], $encodeCalls);
    }

    #[Test]
    #[TestDox('v3: the configured driver name is forwarded to the Intervention read call')]
    public function v3ForwardsDriver(): void
    {
        $encodeCalls = [];
        $image = $this->createV3Image($encodeCalls);
        $image->expects(self::once())->method('scaleDown')->willReturnSelf();

        SpyUploadService::$version = 3;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['driver' => 'imagick', 'width' => 4]);

        self::assertCount(1, SpyUploadService::$reads);
        self::assertSame('imagick', SpyUploadService::$reads[0][1]);
    }

    #[Test]
    #[TestDox('v2: a resize calls orientate(), resize() with the width and streams with default quality')]
    public function v2ResizeCallsOrientateAndResize(): void
    {
        $image = $this->createV2Image();
        $image->expects(self::once())->method('orientate')->willReturnSelf();
        $image->expects(self::once())
            ->method('resize')
            ->with(4, null, $this->callableConstraint())
            ->willReturnSelf();
        $image->expects(self::never())->method('fit');
        $image->expects(self::once())
            ->method('stream')
            ->with(null, 90)
            ->willReturn(Utils::streamFor('v2-bytes'));

        SpyUploadService::$version = 2;
        SpyUploadService::$image = $image;

        $result = $this->createService()->resizeImage($this->source(), ['width' => 4]);

        self::assertSame('v2-bytes', $this->bytesOf($result));
    }

    #[Test]
    #[TestDox('v2: orientate() is skipped when orientate is disabled')]
    public function v2OrientateCanBeDisabled(): void
    {
        $image = $this->createV2Image();
        $image->expects(self::never())->method('orientate');
        $image->expects(self::once())->method('resize')->willReturnSelf();
        $image->expects(self::once())->method('stream')->willReturn(Utils::streamFor(''));

        SpyUploadService::$version = 2;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['width' => 4, 'orientate' => false]);
    }

    #[Test]
    #[TestDox('v2: crop with width and height calls fit() and not resize()')]
    public function v2CropCallsFit(): void
    {
        $image = $this->createV2Image();
        $image->expects(self::once())
            ->method('fit')
            ->with(4, 4, $this->callableConstraint())
            ->willReturnSelf();
        $image->expects(self::never())->method('resize');
        $image->expects(self::once())->method('stream')->willReturn(Utils::streamFor(''));

        SpyUploadService::$version = 2;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['width' => 4, 'height' => 4, 'crop' => true]);
    }

    #[Test]
    #[TestDox('v2: width and height without crop calls resize() with both dimensions')]
    public function v2ResizeWithBothDimensions(): void
    {
        $image = $this->createV2Image();
        $image->expects(self::once())
            ->method('resize')
            ->with(4, 4, $this->callableConstraint())
            ->willReturnSelf();
        $image->expects(self::never())->method('fit');
        $image->expects(self::once())->method('stream')->willReturn(Utils::streamFor(''));

        SpyUploadService::$version = 2;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['width' => 4, 'height' => 4]);
    }

    #[Test]
    #[TestDox('v2: disabled resize still orientates, but does not resize or fit, and streams the output format')]
    public function v2DisabledStreamsOnly(): void
    {
        $image = $this->createV2Image();
        $image->expects(self::once())->method('orientate')->willReturnSelf();
        $image->expects(self::never())->method('resize');
        $image->expects(self::never())->method('fit');
        $image->expects(self::once())
            ->method('stream')
            ->with('png', 90)
            ->willReturn(Utils::streamFor('png-bytes'));

        SpyUploadService::$version = 2;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['enabled' => false, 'outputFormat' => 'png']);
    }

    #[Test]
    #[TestDox('v2: stripExif on Imagick calls getCore()->stripImage()')]
    public function v2StripExifOnImagickStripsCore(): void
    {
        $core = $this->createMock(V2Core::class);
        $core->expects(self::once())->method('stripImage')->willReturnSelf();

        $image = $this->createV2Image();
        $image->expects(self::once())->method('getCore')->willReturn($core);
        $image->expects(self::once())->method('stream')->willReturn(Utils::streamFor(''));

        SpyUploadService::$version = 2;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['driver' => 'imagick', 'stripExif' => true]);
    }

    #[Test]
    #[TestDox('v2: stripExif on GD does not touch the Imagick core')]
    public function v2StripExifOnGdSkipsCore(): void
    {
        $image = $this->createV2Image();
        $image->expects(self::never())->method('getCore');
        $image->expects(self::once())->method('stream')->willReturn(Utils::streamFor(''));

        SpyUploadService::$version = 2;
        SpyUploadService::$image = $image;

        $this->createService()->resizeImage($this->source(), ['driver' => 'gd', 'stripExif' => true]);
    }
}

/**
 * Forces the Intervention version and image reader so each test can inject mocks.
 */
class SpyUploadService extends FileUploadService
{
    public static int $version = 3;

    public static ?object $image = null;

    /**
     * @var array<int, array{0: mixed, 1: string}>
     */
    public static array $reads = [];

    public static function reset(): void
    {
        static::$version = 3;
        static::$image = null;
        static::$reads = [];
    }

    protected function getInterventionVersion(): int
    {
        return static::$version;
    }

    protected function readImage(mixed $src, string $driver): object
    {
        static::$reads[] = [$src, $driver];

        return static::$image;
    }
}

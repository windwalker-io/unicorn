<?php

declare(strict_types=1);

namespace Unicorn\Tests\Image;

use GuzzleHttp\Psr7\Utils;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Exceptions\DecoderException;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\ImageInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Unicorn\Image\Decoder\PsrStreamGdDecoder;

/**
 * Tests for PsrStreamGdDecoder decoding PSR-7 streams with GD.
 */
class PsrStreamGdDecoderTest extends TestCase
{
    #[Test]
    #[TestDox('decode() reads a PSR-7 stream into an image')]
    public function decodesStream(): void
    {
        $gd = imagecreatetruecolor(5, 2);
        ob_start();
        imagepng($gd);
        $binary = (string) ob_get_clean();

        $image = ImageManager::usingDriver(GdDriver::class)->decode(Utils::streamFor($binary), PsrStreamGdDecoder::class);

        self::assertInstanceOf(ImageInterface::class, $image);
        self::assertSame(5, $image->width());
        self::assertSame(2, $image->height());
    }

    #[Test]
    #[TestDox('decode() rejects inputs that are not PSR-7 streams')]
    public function rejectsNonStreamInput(): void
    {
        $this->expectException(DecoderException::class);

        ImageManager::usingDriver(GdDriver::class)->decode('not-a-stream', PsrStreamGdDecoder::class);
    }
}

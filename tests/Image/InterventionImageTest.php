<?php

declare(strict_types=1);

namespace Unicorn\Tests\Image;

use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\ImageInterface;
use GuzzleHttp\Psr7\Utils;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Unicorn\Image\InterventionImage;

/**
 * Tests for InterventionImage.
 *
 * version() is a static method, and create()/read() call static::version(),
 * so subclasses can simulate a different Intervention major version
 * without modifying the production class.
 */
class InterventionImageTest extends TestCase
{
    private static string $pngPath;

    public static function setUpBeforeClass(): void
    {
        self::$pngPath = sys_get_temp_dir() . '/unicorn-intervention-test-' . uniqid() . '.png';

        $gd = imagecreatetruecolor(4, 3);
        imagepng($gd, self::$pngPath);
    }

    public static function tearDownAfterClass(): void
    {
        @unlink(self::$pngPath);
    }

    #[Test]
    #[TestDox('version() reports 3 for the installed Intervention Image')]
    public function version(): void
    {
        self::assertSame(3, InterventionImage::version());
    }

    #[Test]
    #[TestDox('create() with "gd" returns a manager bound to the GD driver')]
    public function createWithGdString(): void
    {
        $manager = InterventionImage::create('gd');

        self::assertInstanceOf(ImageManager::class, $manager);
        self::assertInstanceOf(GdDriver::class, $manager->driver());
    }

    #[Test]
    #[TestDox('create() with "imagick" maps to the Imagick driver class')]
    public function createWithImagickString(): void
    {
        if (!extension_loaded('imagick')) {
            self::markTestSkipped('Imagick extension is not installed.');
        }

        $manager = InterventionImage::create('imagick');

        self::assertInstanceOf(ImagickDriver::class, $manager->driver());
    }

    #[Test]
    #[TestDox('create() passes a DriverInterface instance through unchanged')]
    public function createWithDriverInstance(): void
    {
        $driver = new GdDriver();

        $manager = InterventionImage::create($driver);

        self::assertSame($driver, $manager->driver());
    }

    #[Test]
    #[TestDox('read() decodes a file path with the GD driver')]
    public function readFilePath(): void
    {
        $image = InterventionImage::read(self::$pngPath);

        self::assertInstanceOf(ImageInterface::class, $image);
        self::assertSame(4, $image->width());
        self::assertSame(3, $image->height());
    }

    #[Test]
    #[TestDox('read() decodes a PSR stream via the GD stream decoder')]
    public function readStreamWithGd(): void
    {
        $stream = Utils::streamFor((string) file_get_contents(self::$pngPath));

        $image = InterventionImage::read($stream, 'gd');

        self::assertSame(4, $image->width());
        self::assertSame(3, $image->height());
    }

    #[Test]
    #[TestDox('read() with a v2 subclass takes the v2 branch and fails on the v3 ImageManager API')]
    public function readUsesV2BranchWhenVersionIsTwo(): void
    {
        $legacy = new class extends InterventionImage {
            public static function version(): int
            {
                return 2;
            }
        };

        // v2 calls `new ImageManager(['driver' => ...])`, which v3 rejects with a TypeError.
        $this->expectException(\TypeError::class);
        $this->expectExceptionMessageIsOrContains('ImageManager::__construct()');

        $legacy::read(self::$pngPath);
    }

    #[Test]
    #[TestDox('create() with a v2 subclass uses the legacy constructor signature')]
    public function createUsesV2BranchWhenVersionIsTwo(): void
    {
        $legacy = new class extends InterventionImage {
            public static function version(): int
            {
                return 2;
            }
        };

        // v3 ImageManager does not accept an array config, so the v2 path fails here.
        // The failure proves the v2 constructor call was taken.
        $this->expectException(\TypeError::class);
        $this->expectExceptionMessageIsOrContains('array given');

        $legacy::create('gd');
    }
}

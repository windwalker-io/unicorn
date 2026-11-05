<?php

declare(strict_types=1);

namespace Unicorn\Tests\Image;

use GuzzleHttp\Psr7\Utils;
use Intervention\Image\Interfaces\DriverInterface;
use Intervention\Image\Interfaces\ImageInterface;
use Intervention\Image\Interfaces\ImageManagerInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Unicorn\Image\Decoder\PsrStreamGdDecoder;
use Unicorn\Image\Decoder\PsrStreamImagickDecoder;
use Unicorn\Image\InterventionImage;
use Unicorn\Tests\Support\Intervention\V2ImageManager;

/**
 * Verifies the exact Intervention calls made by InterventionImage for v2 and v3, using mocks.
 */
class InterventionImageMockTest extends TestCase
{
    protected function setUp(): void
    {
        SpyIntervention::reset();
    }

    private function driverMock(string $id): DriverInterface
    {
        $driver = $this->createStub(DriverInterface::class);
        $driver->method('id')->willReturn($id);

        return $driver;
    }

    #[Test]
    #[TestDox('v3 create() maps "gd" to the GD driver class and builds the manager through the v3 seam')]
    public function v3CreateGd(): void
    {
        SpyIntervention::$fakeVersion = 3;
        $manager = $this->createStub(ImageManagerInterface::class);
        SpyIntervention::$manager = $manager;

        $result = SpyIntervention::create('gd');

        self::assertSame($manager, $result);
        self::assertSame(
            [['v3', 'Intervention\Image\Drivers\Gd\Driver']],
            SpyIntervention::$seamCalls
        );
    }

    #[Test]
    #[TestDox('v3 create() maps "imagick" to the Imagick driver class')]
    public function v3CreateImagick(): void
    {
        SpyIntervention::$manager = $this->createStub(ImageManagerInterface::class);

        SpyIntervention::create('imagick');

        self::assertSame(
            [['v3', 'Intervention\Image\Drivers\Imagick\Driver']],
            SpyIntervention::$seamCalls
        );
    }

    #[Test]
    #[TestDox('v3 create() passes a driver instance through unchanged')]
    public function v3CreatePassesDriverInstance(): void
    {
        SpyIntervention::$manager = $this->createStub(ImageManagerInterface::class);
        $driver = $this->createStub(DriverInterface::class);

        SpyIntervention::create($driver);

        self::assertCount(1, SpyIntervention::$seamCalls);
        self::assertSame($driver, SpyIntervention::$seamCalls[0][1]);
    }

    #[Test]
    #[TestDox('v2 create() passes the driver in a config array to the v2 seam')]
    public function v2CreateUsesConfigArray(): void
    {
        SpyIntervention::$fakeVersion = 2;
        $manager = $this->createStub(V2ImageManager::class);
        SpyIntervention::$manager = $manager;

        $result = SpyIntervention::create('imagick');

        self::assertSame($manager, $result);
        self::assertSame([['v2', ['driver' => 'imagick']]], SpyIntervention::$seamCalls);
    }

    #[Test]
    #[TestDox('v3 read() of a path calls read() with the path only and checks the driver')]
    public function v3ReadPath(): void
    {
        $image = $this->createStub(ImageInterface::class);

        $manager = $this->createMock(ImageManagerInterface::class);
        $manager->expects(self::once())->method('driver')->willReturn($this->driverMock('GD'));
        $manager->expects(self::once())->method('read')->with('/tmp/a.png')->willReturn($image);

        SpyIntervention::$manager = $manager;

        self::assertSame($image, SpyIntervention::read('/tmp/a.png'));
    }

    #[Test]
    #[TestDox('v3 read() of a stream on GD uses the GD stream decoder')]
    public function v3ReadStreamGd(): void
    {
        $stream = Utils::streamFor('bytes');
        $image = $this->createStub(ImageInterface::class);

        $manager = $this->createMock(ImageManagerInterface::class);
        $manager->method('driver')->willReturn($this->driverMock('GD'));
        $manager->expects(self::once())
            ->method('read')
            ->with($stream, PsrStreamGdDecoder::class)
            ->willReturn($image);

        SpyIntervention::$manager = $manager;

        self::assertSame($image, SpyIntervention::read($stream, 'gd'));
    }

    #[Test]
    #[TestDox('v3 read() of a stream on Imagick uses the Imagick stream decoder')]
    public function v3ReadStreamImagick(): void
    {
        $stream = Utils::streamFor('bytes');
        $image = $this->createStub(ImageInterface::class);

        $manager = $this->createMock(ImageManagerInterface::class);
        $manager->method('driver')->willReturn($this->driverMock('Imagick'));
        $manager->expects(self::once())
            ->method('read')
            ->with($stream, PsrStreamImagickDecoder::class)
            ->willReturn($image);

        SpyIntervention::$manager = $manager;

        self::assertSame($image, SpyIntervention::read($stream, 'imagick'));
    }

    #[Test]
    #[TestDox('v2 read() of a path calls make() on the v2 manager')]
    public function v2ReadPath(): void
    {
        SpyIntervention::$fakeVersion = 2;
        $image = $this->createStub(\Unicorn\Tests\Support\Intervention\V2Image::class);

        $manager = $this->createMock(V2ImageManager::class);
        $manager->expects(self::once())->method('make')->with('/tmp/a.jpg')->willReturn($image);

        SpyIntervention::$manager = $manager;

        self::assertSame($image, SpyIntervention::read('/tmp/a.jpg'));
    }

    #[Test]
    #[TestDox('v2 read() of a stream calls make() with the stream, without decoder classes')]
    public function v2ReadStream(): void
    {
        SpyIntervention::$fakeVersion = 2;
        $stream = Utils::streamFor('bytes');
        $image = $this->createStub(\Unicorn\Tests\Support\Intervention\V2Image::class);

        $manager = $this->createMock(V2ImageManager::class);
        $manager->expects(self::once())->method('make')->with($stream)->willReturn($image);

        SpyIntervention::$manager = $manager;

        self::assertSame($image, SpyIntervention::read($stream));
    }
}

/**
 * Overrides the version check and manager seams so each test can inject a mock manager.
 */
class SpyIntervention extends InterventionImage
{
    public static int $fakeVersion = 3;

    public static ?object $manager = null;

    /**
     * @var array<int, array{0: string, 1: mixed}>
     */
    public static array $seamCalls = [];

    public static function reset(): void
    {
        static::$fakeVersion = 3;
        static::$manager = null;
        static::$seamCalls = [];
    }

    public static function version(): int
    {
        return static::$fakeVersion;
    }

    protected static function createV2Manager(array $config): object
    {
        static::$seamCalls[] = ['v2', $config];

        return static::$manager;
    }

    protected static function createV3Manager(string|DriverInterface $driver): object
    {
        static::$seamCalls[] = ['v3', $driver];

        return static::$manager;
    }
}

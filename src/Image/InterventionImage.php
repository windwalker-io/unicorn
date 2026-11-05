<?php

declare(strict_types=1);

namespace Unicorn\Image;

use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\DriverInterface;
use Psr\Http\Message\StreamInterface;
use Unicorn\Image\Decoder\PsrStreamGdDecoder;
use Unicorn\Image\Decoder\PsrStreamImagickDecoder;

class InterventionImage
{
    public static function create(string|DriverInterface $driver = 'gd'): object
    {
        if (static::version() === 2) {
            return static::createV2Manager(['driver' => $driver]);
        }

        $driver = match ($driver) {
            'gd' => GdDriver::class,
            'imagick' => ImagickDriver::class,
            default => $driver
        };

        return static::createV3Manager($driver);
    }

    public static function read(mixed $image, string|DriverInterface $driver = 'gd'): object
    {
        $manager = static::create($driver);

        if (static::version() === 2) {
            return $manager->make($image);
        }

        $driver = $manager->driver();

        if ($image instanceof StreamInterface) {
            return $manager->read(
                $image,
                $driver->id() === 'GD'
                    ? PsrStreamGdDecoder::class
                    : PsrStreamImagickDecoder::class
            );
        }

        return $manager->read($image);
    }

    /**
     * Build the Intervention v3 manager. Overridable so the v3 flow can be tested with mocks.
     *
     * @param  string|DriverInterface  $driver
     *
     * @return  object
     */
    protected static function createV3Manager(string|DriverInterface $driver): object
    {
        return new ImageManager($driver);
    }

    /**
     * Build the Intervention v2 manager. Overridable so the v2 flow can be tested
     * without a real v2 installation.
     *
     * @param  array  $config
     *
     * @return  object
     */
    protected static function createV2Manager(array $config): object
    {
        return new ImageManager($config);
    }

    public static function version(): int
    {
        return method_exists(ImageManager::class, 'withDriver') ? 3 : 2;
    }
}

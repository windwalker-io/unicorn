<?php

declare(strict_types=1);

namespace Unicorn\Image;

use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\DriverInterface;
use Intervention\Image\Interfaces\ImageInterface;

class InterventionImage
{
    public static function create(string|DriverInterface $driver = 'gd'): ImageManager
    {
        if (static::version() === 2) {
            return new ImageManager(['driver' => $driver]);
        }

        $driver = match ($driver) {
            'gd' => GdDriver::class,
            'imagick' => ImagickDriver::class,
            default => $driver
        };

        return new ImageManager($driver);
    }

    public static function read(mixed $image, string|DriverInterface $driver = 'gd'): ImageInterface
    {
        $manager = static::create($driver);

        if (static::version() === 2) {
            return $manager->make($image);
        }

        return $manager->read($image);
    }

    public static function version(): int
    {
        return method_exists(ImageManager::class, 'withDriver') ? 3 : 2;
    }
}

<?php

declare(strict_types=1);

namespace App\Config;

use Unicorn\Aws\S3Service;
use Unicorn\Listener\DumpOrphansSubscriber;
use Unicorn\Listener\UnicornAssetSubscriber;
use Unicorn\UnicornPackage;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ConfigModule;

return #[ConfigModule(name: 'unicorn', enabled: true, priority: 100, belongsTo: UnicornPackage::class)]
static fn() => [
    'listeners' => [
        AssetService::class => [
            UnicornAssetSubscriber::class,
        ],
        AppContext::class => [
            DumpOrphansSubscriber::class,
        ],
    ],

    'providers' => [
        UnicornPackage::class,
    ],

    'modules' => [
        'next' => true
    ],

    'file_upload' => [
        'default' => 'default',

        /**
         * File upload settings.
         * --------------------------------------------------
         *
         * Options:
         * - storage: The Storage name
         * - accept: Accepted mime type or extensions, use (,) to separate multiple.
         * - dir: The default upload dir, use {year}, {month}, {day}, {hour}, {minute}, {second}, {ext}
         *          variables to replace file path.
         * - force_redraw: (bool) Force redraw image to wipe malware, must be TRUE if we allow front end uploads.
         * - resize:
         *      - enabled: (bool) Enable resize or not.
         *      - driver: `gd` or `imagick`.
         *      - strip_exif: (bool) Strip EXIF to reduce image size, only works for `imagick` driver.
         *      - width: (int) Image crop width or max width (px).
         *      - height: (int) Image crop height or max height (px).
         *      - crop: (bool) Crop image or not.
         *      - quality: (int) JPEG quality. (default: 85)
         *      - output_format: The output image format, if not provided, will auto detect.
         *      - orientate: (bool) Auto rotate images based on orientate info.
         * - raw_gif: (bool) If is gif file, use raw file, ignore redraw or resize.
         * - options: The extra options for different storages.
         *
         * --------------------------------------------------
         */
        'profiles' => [
            'default' => [
                'storage' => env('UPLOAD_STORAGE_DEFAULT') ?: 'local',
                'accept' => null,
                'dir' => 'files/{year}/{month}/{day}',
                'resize' => [
                    'enabled' => false,
                    'driver' => env('IMAGE_RESIZE_DRIVER', 'gd'),
                ],
            ],
            'image' => [
                'storage' => env('UPLOAD_STORAGE_DEFAULT') ?: 'local',
                'accept' => 'image/*',
                'dir' => 'images/{year}/{month}/{day}',
                'raw_gif' => true,
                'resize' => [
                    'enabled' => true,
                    'driver' => env('IMAGE_RESIZE_DRIVER', 'gd'),
                    'width' => 1200,
                    'height' => 1200,
                    'crop' => false,
                    'quality' => 85,
                    'output_format' => null,
                ],
                'options' => [
                    'ACL' => S3Service::ACL_PUBLIC_READ,
                ],
            ],
            'frontend' => [
                'storage' => env('UPLOAD_STORAGE_DEFAULT') ?: 'local',
                'accept' => 'image/*',
                'dir' => 'files/{year}/{month}/{day}',
                'force_redraw' => true,
                'resize' => [
                    'enabled' => true,
                    'driver' => env('IMAGE_RESIZE_DRIVER', 'gd'),
                    'width' => 1200,
                    'height' => 1200,
                    'crop' => false,
                    'quality' => 85,
                    'output_format' => null,
                ],
                'options' => [
                    'ACL' => S3Service::ACL_PUBLIC_READ,
                ],
            ],
        ],
    ],
];

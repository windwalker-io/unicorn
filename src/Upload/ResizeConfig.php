<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Windwalker\Utilities\Options\RecordOptions;

class ResizeConfig extends RecordOptions
{
    public function __construct(
        public bool $enabled = true,
        public string $driver = FileUploadService::DRIVER_GD,
        public bool $stripExif = false,
        public ?int $width = null,
        public ?int $height = null,
        public int $quality = 90,
        public bool $crop = false,
        public ?string $outputFormat = null,
        public bool $orientate = true,
    ) {
    }
}

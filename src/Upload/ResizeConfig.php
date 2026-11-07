<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Windwalker\Utilities\Options\RecordOptions;

class ResizeConfig extends RecordOptions
{
    public function __construct(
        public bool $enabled = true,
        public string $driver = FileUploadService::DRIVER_GD,
        /**
         * @deprecated  No longer has any effect. Kept only for constructor position and BC.
         */
        public bool $stripExif = false,
        public ?int $width = null,
        public ?int $height = null,
        public ?int $quality = 85,
        public bool $crop = false,
        public ?string $outputFormat = null,
        public bool $orientate = true,
        /**
         * Interlaced output. Only applies to PNG and GIF, ignored for other formats.
         */
        public bool $interlaced = false,
    ) {}
}

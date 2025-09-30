<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Windwalker\Utilities\Options\RecordOptions;

class FileUploadOptions extends RecordOptions
{
    public const string DRIVER_GD = 'gd';

    public const string DRIVER_IMAGICK = 'imagick';

    public ?ResizeConfig $resize = null {
        set(mixed $value) => ResizeConfig::tryWrap($value, true);
        get => $this->resize ??= new ResizeConfig();
    }

    public array $storageOptions = [];

    public function __construct(
        public string $storage = 'local',
        public ?string $dir = null,
        public ?string $accept = null,
        public bool $forceRedraw = false,
        public bool $rawGif = false,
        public bool|int|array $optimize = false,
        ResizeConfig|array $resize = new ResizeConfig(),
        array $storageOptions = [],
        array $options = [],
    ) {
        $this->resize = $resize;
        $this->storageOptions = [...$options, ...$storageOptions];
    }
}

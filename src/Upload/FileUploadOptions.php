<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Windwalker\Utilities\Options\RecordOptions;

// Todo: must handle extra `enabled` option issues
// @see https://github.com/windwalker-io/core/issues/1500
#[\AllowDynamicProperties]
class FileUploadOptions extends RecordOptions
{
    public const string DRIVER_GD = 'gd';

    public const string DRIVER_IMAGICK = 'imagick';

    public ?ResizeConfig $resize = null {
        set(mixed $value) => ResizeConfig::tryWrap($value, true);
        get => $this->resize ??= new ResizeConfig();
    }

    public array $storageOptions = [];

    public array $options {
        set(mixed $value) => $this->storageOptions = [...$this->storageOptions, ...$value];
    }

    public function __construct(
        public string $storage = 'local',
        public ?string $dir = null,
        /** @var string[]|null Allowed extensions, e.g. `['jpg', 'png']`. Null or empty means no check. */
        public ?array $acceptExtensions = null,
        /** @var string[]|null Allowed mime types, wildcard supported, e.g. `['image/*']`. Null or empty means no check. */
        public ?array $acceptMimeTypes = null,
        public bool $forceRedraw = false,
        public bool $rawGif = false,
        public bool|int|array $optimize = false,
        ResizeConfig|array $resize = new ResizeConfig(),
        array $storageOptions = [],
        array $options = [],
        /** Sanitize uploaded SVG files (remove scripts, event handlers, unsafe URLs). Disable only for trusted uploaders. */
        public bool $sanitizeSvg = true,
    ) {
        $this->resize = $resize;
        $this->storageOptions = [...$options, ...$storageOptions];
    }
}

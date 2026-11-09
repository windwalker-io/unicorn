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

    /**
     * Computed from `accept`: entries without `/`.
     *
     * @var  string[]
     */
    public array $acceptExtensions {
        get => array_values(array_filter(
            $this->accept ?? [],
            static fn($item) => !str_contains((string) $item, '/')
        ));
    }

    /**
     * Computed from `accept`: entries containing `/`.
     *
     * @var  string[]
     */
    public array $acceptMimeTypes {
        get => array_values(array_filter(
            $this->accept ?? [],
            static fn($item) => str_contains((string) $item, '/')
        ));
    }

    public ?array $accept = null;

    public function __construct(
        public string $storage = 'local',
        public ?string $dir = null,
        /**
         * Allowed entries. An entry containing `/` is a mime type (wildcard supported, e.g. `image/*`),
         * otherwise it is an extension (e.g. `jpg`). Null or empty means no check.
         */
        array|string|null $accept = null,
        public bool $forceRedraw = false,
        public bool $rawGif = false,
        public bool|int|array $optimize = false,
        ResizeConfig|array $resize = new ResizeConfig(),
        array $storageOptions = [],
        array $options = [],
        /** Sanitize uploaded SVG files (remove scripts, event handlers, unsafe URLs). Disable only for trusted uploaders. */
        public bool $sanitizeSvg = true,
    ) {
        if (is_string($accept)) {
            $accept = array_map('trim', explode(',', $accept));
        }

        $this->accept = $accept;
        $this->resize = $resize;
        $this->storageOptions = [...$options, ...$storageOptions];
    }
}

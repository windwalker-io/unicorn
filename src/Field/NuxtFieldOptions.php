<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Utilities\Options\RecordOptionsTrait;
use Windwalker\Utilities\TypeCast;

/**
 * Options passed from NuxtEditorField to the `nuxt-editor` JS module.
 *
 * Every property is nullable: null means "not set", so an object used as `defaultOptions`
 * or `editorOptions` only overrides the values that were explicitly given when merged.
 * Unknown keys are kept and forwarded as-is.
 */
#[\AllowDynamicProperties]
class NuxtFieldOptions implements \JsonSerializable
{
    use RecordOptionsTrait {
        merge as protected traitMerge;
    }

    public function __construct(
        /**
         * html | markdown | json
         */
        public ?string $format = null,
        public ?string $locale = null,
        public ?bool $readonly = null,
        public ?string $imageUploadUrl = null,
        /**
         * Extra props passed to Nuxt UI `UEditor`.
         *
         * @var  array<string, mixed>|null
         */
        public ?array $props = null,
        /**
         * @var  array{stack_name?: string}|null
         */
        public ?array $unicorn = null,
        /**
         * Image attributes that mirror the caption text. A list: it is replaced, not merged.
         *
         * @var  string[]|null
         */
        public ?array $captionSyncAttrs = null,
        /**
         * true: the output HTML renders a caption as `<figure><img><figcaption>`.
         * false: the caption is only saved into the `captionSyncAttrs` (title & alt), left for the frontend to render.
         */
        public ?bool $captionFigure = null,
        /**
         * Backend endpoint that downloads a remote image and stores it.
         * Receives POST `{url}` and returns `{data: {url}}` like the upload endpoint.
         * When set, pasted images from other hosts are sent here and replaced with the stored URL.
         */
        public ?string $imageFetchUrl = null,
        /**
         * Hosts treated as "own" (not fetched). Empty: only the current page host. A list: it is replaced, not merged.
         *
         * @var  string[]|null
         */
        public ?array $imageOwnHosts = null,
    ) {}

    public function merge(mixed $values, bool $recursive = false, bool $ignoreNulls = false): static
    {
        $values = $values instanceof self ? $values->toArray() : TypeCast::toArray($values);

        foreach (['captionSyncAttrs', 'imageOwnHosts'] as $listKey) {
            if (isset($values[$listKey])) {
                $this->$listKey = array_values((array) $values[$listKey]);
            }

            unset($values[$listKey]);
        }

        // Nulls never override already-set values.
        return $this->traitMerge($values, $recursive, true);
    }

    /**
     * @return    array{
     *           format?: string,
     *           locale?: string,
     *           readonly?: bool,
     *           imageUploadUrl?: string,
     *           props?: array<string, mixed>,
     *           unicorn?: array{stack_name?: string},
     *           captionSyncAttrs?: string[],
     *           captionFigure?: bool,
     *           imageFetchUrl?: string,
     *           imageOwnHosts?: string[],
     *           ...
     *           }
     */
    public function toArray(): array
    {
        return array_filter(get_object_vars($this), static fn($v) => $v !== null);
    }

    /**
     * @return  array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}

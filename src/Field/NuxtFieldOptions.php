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
         */
        public ?array $props = null,
        public ?array $unicorn = null,
        /**
         * Image attributes that mirror the caption text. A list: it is replaced, not merged.
         *
         * @var  string[]|null
         */
        public ?array $captionSyncAttrs = null,
        /**
         * Reflect caption typing into the output HTML on every keystroke. If false, only on blur / Enter.
         */
        public ?bool $captionLive = null,
    ) {}

    public function merge(mixed $values, bool $recursive = false, bool $ignoreNulls = false): static
    {
        $values = $values instanceof self ? $values->toArray() : TypeCast::toArray($values);

        if (isset($values['captionSyncAttrs'])) {
            $this->captionSyncAttrs = array_values((array) $values['captionSyncAttrs']);
        }

        unset($values['captionSyncAttrs']);

        // Nulls never override already-set values.
        return $this->traitMerge($values, $recursive, true);
    }

    public function toArray(): array
    {
        return array_filter(get_object_vars($this), static fn($v) => $v !== null);
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}

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

    /**
     * Built-in code block languages (same as the JS default). Copy it to tweak, e.g.
     * `codeBlockLanguages: [...NuxtFieldOptions::DEFAULT_CODE_BLOCK_LANGUAGES, 'rust' => 'Rust']`.
     */
    public const array DEFAULT_CODE_BLOCK_LANGUAGES = [
        'html' => 'HTML',
        'css' => 'CSS',
        'javascript' => 'JavaScript',
        'typescript' => 'TypeScript',
        'json' => 'JSON',
        'php' => 'PHP',
        'sql' => 'SQL',
        'bash' => 'Bash',
        'python' => 'Python',
        'xml' => 'XML',
        'yaml' => 'YAML',
        'markdown' => 'Markdown',
    ];

    /**
     * Built-in code block aliases (same as the JS default).
     */
    public const array DEFAULT_CODE_BLOCK_ALIASES = [
        'js' => 'javascript',
        'jsx' => 'javascript',
        'mjs' => 'javascript',
        'ts' => 'typescript',
        'tsx' => 'typescript',
        'md' => 'markdown',
        'yml' => 'yaml',
        'sh' => 'bash',
        'shell' => 'bash',
        'zsh' => 'bash',
        'py' => 'python',
        'htm' => 'html',
        'text' => '',
        'plain' => '',
        'plaintext' => '',
    ];

    /**
     * Built-in table color palette (same as the JS default).
     */
    public const array DEFAULT_TABLE_COLORS = [
        'Primary' => 'var(--bs-primary)',
        'Secondary' => 'var(--bs-secondary)',
        'Success' => 'var(--bs-success)',
        'Danger' => 'var(--bs-danger)',
        'Warning' => 'var(--bs-warning)',
        'Info' => 'var(--bs-info)',
        'Gray' => '#6b7280',
        'Red' => '#ef4444',
        'Orange' => '#f97316',
        'Yellow' => '#eab308',
        'Green' => '#22c55e',
        'Blue' => '#3b82f6',
        'Purple' => '#a855f7',
        'Pink' => '#ec4899',
    ];

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
        /**
         * Languages of the code block selector (value => label). Replaced, not merged. Empty: a built-in list.
         *
         * @var  array<string, string>|null
         */
        public ?array $codeBlockLanguages = null,
        /**
         * Language aliases (alias => language value, '' = plain text). Replaced, not merged.
         * Empty: DEFAULT_CODE_BLOCK_ALIASES.
         *
         * @var  array<string, string>|null
         */
        public ?array $codeBlockAliases = null,
        /**
         * Palette of the table cell Text/Background Colors menus (label => CSS color; background is made translucent).
         * Bootstrap variables work, e.g. ['Primary' => 'var(--bs-primary)', 'Warning' => 'var(--bs-warning)'].
         * Replaced, not merged. Empty: DEFAULT_TABLE_COLORS.
         *
         * @var  array<string, string>|null
         */
        public ?array $tableColors = null,
    ) {}

    public function merge(mixed $values, bool $recursive = false, bool $ignoreNulls = false): static
    {
        $values = $values instanceof self ? $values->toArray() : TypeCast::toArray($values);

        // Array options are replaced as a whole instead of being recursively merged with the defaults,
        // so users can shrink a list. They are handled here and removed from $values before traitMerge().
        // The (array) cast guards against objects (stdClass/ArrayObject), which would TypeError on `?array`.
        foreach (['codeBlockLanguages', 'codeBlockAliases', 'tableColors'] as $mapKey) {
            if (isset($values[$mapKey])) {
                $this->$mapKey = (array) $values[$mapKey];
            }

            unset($values[$mapKey]);
        }

        // Lists are also re-indexed so they serialize to a JSON array, not an object.
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
     *           codeBlockLanguages?: array<string, string>,
     *           codeBlockAliases?: array<string, string>,
     *           tableColors?: array<string, string>,
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

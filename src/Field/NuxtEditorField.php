<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Unicorn\Script\EditorScript;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\HTMLElement;

/**
 * Bridge to Nuxt UI `UEditor` (Tiptap) running in a pure Vue environment.
 *
 * @method  $this  enableImageUpload(bool|string $value = null)
 * @method  mixed  getEnableImageUpload()
 * @method  $this  imageUploadUrl(string $value = null)
 * @method  $this  stackName(string $value)
 * @method  mixed  getStackName()
 * @method  $this  format(string $value)
 * @method  mixed  getFormat()
 */
class NuxtEditorField extends AbstractEditorField
{
    use TranslatorTrait;
    use FileUploadFieldTrait;

    #[Inject]
    protected EditorScript $editorScript;

    public protected(set) ?\Closure $configureOptionsCallback = null;

    /**
     * Global defaults. Accepts an array or a NuxtFieldOptions (only the set values are applied).
     */
    public static array|NuxtFieldOptions $defaultOptions = [];

    public function compileFieldElement(HTMLElement $input, array $options = []): string|HTMLElement
    {
        $this->prepareEditorScript();

        return parent::compileFieldElement($input, $options);
    }

    public function prepareEditorScript(): void
    {
        $options = new NuxtFieldOptions(
            format: $this->getFormat() ?: 'html',
            locale: $this->lang->getLocale() ?: $this->lang->getFallback(),
            readonly: (bool) ($this->isReadonly() || $this->isDisabled()),
            captionSyncAttrs: ['alt', 'title'],
            captionLive: true,
        );

        if ($this->getEnableImageUpload() ?? true) {
            $profile = is_string($profile = $this->getEnableImageUpload()) ? $profile : null;
            $options->imageUploadUrl = $this->getImageUploadUrl($profile);
        }

        // Priority: field state < static defaults < editorOptions.
        $options->merge(static::$defaultOptions, true)->merge($this->getEditorOptions() ?? [], true);
        $options->unicorn = [...($options->unicorn ?? []), 'stack_name' => $this->getStackName() ?: 'uploading'];

        if ($this->configureOptionsCallback) {
            $options = ($this->configureOptionsCallback)($options, $this) ?? $options;
        }

        if ($options instanceof NuxtFieldOptions) {
            $options = $options->toArray();
        }

        $this->editorScript->nuxtEditor('#' . $this->getId(), $options);
    }

    public function getImageUploadUrl(?string $profile = null): string
    {
        return $this->get('imageUploadUrl')
            ?? (string) $this->getBuiltInUploadUrl(
                $this->getUploadProfile() ?: $profile ?? 'image'
            );
    }

    public function configureOptions(?\Closure $configureOptionsCallback): static
    {
        $this->configureOptionsCallback = $configureOptionsCallback;

        return $this;
    }

    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'enableImageUpload',
                'imageUploadUrl',
                'stackName',
                'format',
            ]
        );
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Unicorn\Script\EditorScript;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\HTMLElement;
use Windwalker\Utilities\Arr;

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

    public static array $defaultOptions = [
        'props' => [],
    ];

    public function compileFieldElement(HTMLElement $input, array $options = []): string|HTMLElement
    {
        $this->prepareEditorScript();

        return parent::compileFieldElement($input, $options);
    }

    public function prepareEditorScript(): void
    {
        $options = $this->getEditorOptions() ?? [];

        $defaultOptions = [
            // html | markdown | json
            'format' => $this->getFormat() ?: 'html',
            'locale' => $this->lang->getLocale() ?: $this->lang->getFallback(),
            'readonly' => (bool) ($this->isReadonly() || $this->isDisabled()),
        ];

        if ($this->getEnableImageUpload() ?? true) {
            $profile = is_string($profile = $this->getEnableImageUpload()) ? $profile : null;
            $defaultOptions['imageUploadUrl'] = $this->getImageUploadUrl($profile);
        }

        $options = Arr::mergeRecursive($defaultOptions, static::$defaultOptions, $options);

        $options['unicorn'] = [
            'stack_name' => $this->getStackName() ?: 'uploading',
        ];

        if ($this->configureOptionsCallback) {
            $options = ($this->configureOptionsCallback)($options, $this);
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

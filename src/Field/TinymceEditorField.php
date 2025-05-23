<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Unicorn\Script\EditorScript;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Router\SystemUri;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\HTMLElement;
use Windwalker\Language\LanguageNormalizer;
use Windwalker\Uri\UriNormalizer;
use Windwalker\Utilities\Arr;

/**
 * The TinymceEditorField class.
 *
 * @method  $this  contentCss(string | array $value = null)
 * @method  array  getContentCss()
 * @method  $this  langFolder(string $value = null)
 * @method  mixed  getLangFolder()
 * @method  $this  enableImageUpload(bool|string $value = null)
 * @method  mixed  getEnableImageUpload()
 * @method  $this  imageUploadUrl(string $value = null)
 * @method  $this  stackName(string $value)
 * @method  mixed  getStackName()
 */
class TinymceEditorField extends AbstractEditorField
{
    use TranslatorTrait;
    use FileUploadFieldTrait;

    public const TOOLBAR_SIMPLE = 'simple';

    public const TOOLBAR_FULL = 'full';

    #[Inject]
    protected SystemUri $systemUri;

    #[Inject]
    protected EditorScript $editorScript;

    #[Inject]
    protected AssetService $assetService;

    /**
     * Property defaultOptions.
     *
     * @var  array
     */
    public static array $defaultOptions = [
        'license_key' => 'gpl',
        'height' => 450,
        'convert_urls' => true,
        'fontsize_formats' => '12px 13px 14px 15px 16px 18px 20px 24px 28px 32px',
        'entity_encoding' => 'raw',
        'promotion' => false,
    ];

    /**
     * Method to get property DefaultOptions
     *
     * @return  array
     *
     * @since  1.6.3
     */
    public static function getDefaultOptions(): array
    {
        return static::$defaultOptions;
    }

    /**
     * Method to set property defaultOptions
     *
     * @param  array  $defaultOptions
     *
     * @return  void
     *
     * @since  1.6.3
     */
    public static function setDefaultOptions(array $defaultOptions): void
    {
        static::$defaultOptions = $defaultOptions;
    }

    public function buildFieldElement(HTMLElement $input, array $options = []): string|HTMLElement
    {
        $this->prepareEditorScript();

        return parent::buildFieldElement($input, $options);
    }

    /**
     * @throws \Exception
     */
    public function prepareEditorScript(): void
    {
        $options = $this->getEditorOptions() ?? [];
        $defaultOptions = [
            'relative_urls' => true,
            'document_base_url' => UriNormalizer::ensureDir($this->systemUri->root),
        ];

        $defaultOptions['plugins'] = [];

        $toolbar = $this->getToolbar() ?: static::TOOLBAR_FULL;
        $defaultOptions['font_size_formats'] = '13px 14px 15px 16px 18px 20px 22px 28px 36px 48px';
        $defaultOptions['toolbar_mode'] = 'sliding';
        $defaultOptions['toolbar'] = '';

        if ($toolbar === static::TOOLBAR_FULL) {
            $defaultOptions['plugins'] = [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'preview', 'anchor', 'pagebreak', 'searchreplace', 'wordcount',
                'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
                'media', 'nonbreaking', 'save', 'table', 'directionality',
                'emoticons'
            ];

            $defaultOptions['toolbar'] = 'undo redo ' .
                'bold italic strikethrough forecolor backcolor blockquote removeformat | ' .
                'blocks fontsize styles styleselect formatselect fontsizeselect | ' .
                'alignleft aligncenter alignright alignjustify bullist numlist outdent indent | ' .
                'link image media table code | fullscreen';

            $defaultOptions['image_advtab'] = true;
        }

        if ($options['extra_buttons'] ?? null) {
            $defaultOptions['toolbar'] .= ' ' . implode(
                ' ',
                (array) $options['extra_buttons']
            );
        }

        if ($this->getEnableImageUpload() ?? true) {
            $profile = is_string($profile = $this->getEnableImageUpload()) ? $profile : null;
            $defaultOptions['images_upload_url'] = (string) $this->getImageUploadUrl($profile);
        }

        $defaultOptions['readonly'] = (bool) ($this->isReadonly() || $this->isDisabled());

        //Tables
        $defaultOptions['table_header_type'] = 'sectionCells';
        $defaultOptions['table_class_list'] = [
            ['title' => 'BS Simple', 'value' => 'table'],
            ['title' => 'BS Striped', 'value' => 'table table-striped'],
            ['title' => 'BS Bordered', 'value' => 'table table-bordered'],
            ['title' => 'BS Striped Bordered', 'value' => 'table table-striped table-bordered'],
            ['title' => 'None', 'value' => ''],
        ];

        $options = Arr::mergeRecursive($defaultOptions, static::$defaultOptions, $options);

        // Language
        $options = $this->loadLanguage($options);

        // Set global settings
        $contentCss = (array) ($options['content_css'] ?? $this->getContentCss());

        if ($contentCss === []) {
            $contentCss = [
                $this->assetService->appendVersion(
                    $this->assetService->handleUri('@unicorn/editor.css')
                )
            ];
        }

        $options['content_css'] = implode(',', $contentCss);

        $options['unicorn'] = [
            'stack_name' => $this->getStackName() ?: 'uploading'
        ];

        $this->editorScript->tinymce(
            '#' . $this->getId(),
            $options
        );
    }

    public function getImageUploadUrl(?string $profile): string
    {
        return $this->get('imageUploadUrl')
            ?? (string) $this->getBuiltInUploadUrl(
                $this->getUploadProfile() ?: $profile ?? 'image'
            );
    }

    /**
     * getAccessors
     *
     * @return  array
     *
     * @since   1.2.6
     */
    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'contentCss',
                'langFolder',
                'enableImageUpload',
                'imageUploadUrl',
                'stackName',
            ]
        );
    }

    /**
     * Please install `tinymce-i18n` from npm first.
     *
     * @param  array  $options
     *
     * @return  array
     *
     * @throws \Exception
     */
    protected function loadLanguage(array $options): array
    {
        if ($options['language_url'] ?? null) {
            return $options;
        }

        $lang = $this->lang->getLocale() ?: $this->lang->getFallback();
        [$first] = explode('-', $lang, 2);
        $lang = LanguageNormalizer::shortLangCode($lang);

        $assetFolder = $this->assetService->getAssetFolder();

        // Check vendor path
        $langPath = WINDWALKER_PUBLIC . '/' . $assetFolder . '/vendor/tinymce-i18n/langs5/' . $lang . '.js';
        $langUrl = $this->assetService->root('vendor/tinymce-i18n/langs5/' . $lang . '.js');

        if (!is_file($langPath)) {
            $langPath = WINDWALKER_PUBLIC . '/' . $assetFolder . '/vendor/tinymce-i18n/langs5/' . $first . '.js';
            $langUrl = $this->assetService->root('vendor/tinymce-i18n/langs5/' . $first . '.js');
            $lang = $first;
        }

        if (is_file($langPath)) {
            $options['language'] = $lang;
            $options['language_url'] = $langUrl;
        } elseif (!str_starts_with($lang, 'en') && WINDWALKER_DEBUG) {
            $this->assetService->internalJS("console.warn('Install `tinymce-i18n` to support $lang.');");
        }

        return $options;
    }
}

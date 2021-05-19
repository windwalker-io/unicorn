<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Unicorn\Script\EditorScript;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\DOMElement;
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
 */
class TinymceEditorField extends AbstractEditorField
{
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
    protected static array $defaultOptions = [
        'height' => 450,
        'convert_urls' => true,
        'fontsize_formats' => '12px 13px 14px 15px 16px 18px 20px 24px 28px 32px'
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

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
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
            'document_base_url' => UriNormalizer::ensureDir($this->systemUri->root),
        ];

        $defaultOptions['plugins'] = [];

        $toolbar = $this->getToolbar() ?: static::TOOLBAR_FULL;

        if ($toolbar === static::TOOLBAR_FULL) {
            $defaultOptions['plugins'] = [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table directionality',
                'emoticons template paste textpattern imagetools',
            ];

            $defaultOptions['toolbar1'] = 'insertfile undo redo | styleselect formatselect fontsizeselect ' .
                '| bold italic strikethrough forecolor backcolor | removeformat ' .
                '| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent ' .
                '| link image media | table code | fullscreen';

            $defaultOptions['image_advtab'] = true;
        }

        if ($this->getEnableImageUpload() ?? true) {
            $profile = is_string($profile = $this->getEnableImageUpload()) ? $profile : null;
            $defaultOptions['images_upload_url'] = (string) $this->getImageUploadUrl($profile);
        }

        $defaultOptions['readonly'] = (bool) ($this->isReadonly() || $this->isDisabled());

        $options = Arr::mergeRecursive($defaultOptions, static::$defaultOptions, $options);

        // Language
        // $this->loadLanguage($options);

        // Set global settings
        $contentCss = (array) ($options['content_css'] ?? $this->getContentCss());

        array_unshift(
            $contentCss,
            $this->assetService->handleUri('@unicorn/editor.css')
        );

        $options['content_css'] = implode(',', $contentCss);

        $this->editorScript->tinymce(
            '#' . $this->getId(),
            $options
        );
    }

    public function getImageUploadUrl(?string $profile): string
    {
        return $this->get('imageUploadUrl')
            ?? (string) $this->getBuiltInUploadUrl($profile ?? 'image');
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
            ]
        );
    }
}

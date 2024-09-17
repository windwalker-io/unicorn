<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Psr\Http\Message\UriInterface;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\DOMElement;
use Windwalker\Filesystem\Path;
use Windwalker\Form\Field\FileField;
use Windwalker\Utilities\Str;

/**
 * The DragFileField class.
 *
 * @method $this maxFiles(int $value)
 * @method mixed getMaxFiles()
 * @method $this maxSize(int $value)
 * @method mixed getMaxSize()
 * @method $this height(int $value)
 * @method mixed getHeight()
 */
class FileDragField extends FileField
{
    use LayoutFieldTrait;

    #[Inject]
    protected ApplicationInterface $app;

    protected bool|string $showUploaded = false;

    protected string|\Closure|null $previewLayout = null;

    protected ?\Closure $downloadLinkHandler = null;

    public function getDefaultLayout(): string
    {
        return '@theme::field.file-drag';
    }

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        // Fix accept
        if (trim((string) $this->getAccept())) {
            $this->accept(
                (string) Collection::explode(',', $this->getAccept())
                    ->map('trim')
                    ->map(function ($type) {
                        if (!str_contains($type, '/')) {
                            return Str::ensureLeft($type, '.');
                        }

                        return $type;
                    })
                    ->implode(',')
            );
        }

        $options = array_merge(
            $options,
            $this->getStates()
        );

        if ($this->isMultiple()) {
            $input['name'] = $this->getInputName('[]');
        }

        return $this->renderLayout(
            $this->getLayout(),
            [
                'field' => $this,
                'input' => $input,
                'options' => $options,
            ]
        );
    }

    /**
     * getAccessors
     *
     * @return  array
     */
    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'maxFiles',
                'maxSize',
                'height',
                'layout',
            ]
        );
    }

    public function isShowUploaded(): bool
    {
        if ($this->isMultiple()) {
            return false;
        }

        return (bool) $this->showUploaded;
    }

    public function getShowUploadedPosition(): string
    {
        if ($this->isShowUploaded()) {
            if (is_bool($this->showUploaded)) {
                return 'bottom';
            }

            return $this->showUploaded;
        }

        return '';
    }

    /**
     * @param  bool|string  $showUploaded  bool|top|bottom
     *
     * @return  $this
     */
    public function showUploaded(bool|string $showUploaded): static
    {
        $this->showUploaded = $showUploaded;

        return $this;
    }

    public function getPreviewLayout(): string|\Closure|null
    {
        return $this->previewLayout;
    }

    /**
     * @param  string|\Closure|null  $previewLayout  Closure: ($value, $field) => stringable
     *
     * @return  $this
     */
    public function previewLayout(string|\Closure|null $previewLayout): static
    {
        $this->previewLayout = $previewLayout;

        return $this;
    }

    public function renderPreview(): string|\Stringable
    {
        $layout = $this->getPreviewLayout();

        if ($layout === null) {
            throw new \RuntimeException('Preview layout is NULL');
        }

        if (is_string($layout)) {
            return $this->renderLayout($layout, ['field' => $this]);
        }

        $value = $this->getValue();

        return $this->app->call(
            $layout,
            [
                $value,
                $this,
                'value' => $value,
                'field' => $this,
            ]
        );
    }

    public function getDownloadLinkHandler(): ?\Closure
    {
        return $this->downloadLinkHandler;
    }

    public function downloadLinkHandler(?\Closure $handler): static
    {
        $this->downloadLinkHandler = $handler;

        return $this;
    }

    public function getUploadedFilename(mixed $value): string
    {
        if ($value === '') {
            return '';
        }

        return Path::getFilename($value);
    }

    public function getCompiledDownloadLink(mixed $value): string|UriInterface
    {
        $handler = $this->getDownloadLinkHandler();

        if (!$handler) {
            return (string) $value;
        }

        $value = $this->getValue();

        return $this->app->call(
            $handler,
            [
                $value,
                $this,
                'value' => $value,
                'field' => $this,
            ]
        );
    }
}

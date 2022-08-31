<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Upload;

use Intervention\Image\Constraint;
use Intervention\Image\Exception\NotReadableException;
use Intervention\Image\ImageManager;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UploadedFileInterface;
use Symfony\Component\Mime\MimeTypesInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Unicorn\Flysystem\Base64DataUri;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\StorageInterface;
use Unicorn\Storage\StorageManager;
use Unicorn\Upload\Event\FileUploadedEvent;
use Unicorn\Upload\Exception\FileUploadException;
use Windwalker\Event\EventAwareInterface;
use Windwalker\Event\EventAwareTrait;
use Windwalker\Filesystem\Filesystem;
use Windwalker\Filesystem\Path;
use Windwalker\Http\Helper\UploadedFileHelper;
use Windwalker\Utilities\Options\OptionsResolverTrait;

use function Windwalker\chronos;
use function Windwalker\uid;

/**
 * The FileUploadService class.
 */
class FileUploadService implements EventAwareInterface
{
    use EventAwareTrait;
    use OptionsResolverTrait;

    public const DRIVER_GD = 'gd';

    public const DRIVER_IMAGICK = 'imagick';

    /**
     * FileUploadService constructor.
     */
    public function __construct(
        array $options,
        protected StorageManager $storageManager,
        protected ?MimeTypesInterface $mimeTypes = null
    ) {
        $this->resolveOptions(
            $options,
            [$this, 'configureOptions']
        );
    }

    protected function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->define('accept')
            ->allowedTypes('string', 'null');

        $resolver->define('resize')
            ->allowedTypes('array', 'null')
            ->default(
                function (OptionsResolver $resizeResolver) {
                    $resizeResolver->setDefaults(
                        [
                            'enabled' => true,
                            'driver' => static::DRIVER_GD,
                            'strip_exif' => true,
                            'width' => null,
                            'height' => null,
                            'crop' => false,
                            'quality' => 85,
                            'output_format' => null,
                            'orientate' => true,
                        ]
                    );
                }
            );

        $resolver->define('dir')
            ->allowedTypes('string', 'null')
            ->default(null);

        $resolver->define('force_redraw')
            ->allowedTypes('bool')
            ->default(false);

        $resolver->define('raw_gif')
            ->allowedTypes('bool')
            ->default(false);

        $resolver->define('storage')
            ->allowedTypes('string', 'null')
            ->default('local');

        $resolver->define('options')
            ->allowedTypes('array')
            ->default([]);
    }

    public function setResizeConfig(array $resizeConfig): static
    {
        $this->options['resize'] = array_merge(
            $this->options['resize'],
            $resizeConfig
        );

        return $this;
    }

    public function getStorage(): StorageInterface
    {
        return $this->storageManager->get($this->options['storage']);
    }

    public function handleBase64(string $file, ?string $dest = null, array $options = []): PutResult
    {
        $storage = $this->getStorage();
        $stream = Base64DataUri::toStream($file, $mime);
        $ext = $this->mimeTypes->getExtensions($mime)[0] ?? null;

        $dest ??= $this->getUploadPath($dest, $ext);
        $dest = static::replaceVariables($dest, (string) $ext);

        if (str_starts_with($mime, 'image/') && $this->shouldResize($ext)) {
            $resizeConfig = [];

            if (!str_ends_with($dest, '.{ext}')) {
                $resizeConfig['output_format'] = Path::getExtension($dest);
            }

            $stream = $this->resizeImage($stream, $resizeConfig);
        }

        $options = array_merge($this->getOption('options'), $options);

        $result = $storage->putStream($stream, $dest, $options);

        $event = $this->emit(
            FileUploadedEvent::class,
            compact('file', 'result', 'dest', 'stream', 'options')
        );

        return $event->getResult();
    }

    public function handleFile(UploadedFileInterface $file, ?string $dest = null, array $options = []): PutResult
    {
        if ($file->getError() !== UPLOAD_ERR_OK) {
            $this->throwUploadError($file);
        }

        $storage = $this->getStorage();
        $srcExt = Path::getExtension($file->getClientFilename());
        $dest ??= $this->getUploadPath($dest, $srcExt);

        $dest = static::replaceVariables($dest, $srcExt);

        if ($this->isImage($file) && $this->shouldResize($srcExt)) {
            $resizeConfig = [];

            if (!str_ends_with($dest, '.{ext}')) {
                $resizeConfig['output_format'] = Path::getExtension($dest);
            }

            $stream = $this->resizeImage($file, $resizeConfig);
        } else {
            $stream = $file->getStream();
        }

        $options = array_merge($this->getOption('options'), $options);

        $result = $storage->putStream($stream, $dest, $options);

        $event = $this->emit(
            FileUploadedEvent::class,
            compact('file', 'result', 'dest', 'stream', 'options')
        );

        return $event->getResult();
    }

    public function handleFileIfUploaded(
        ?UploadedFileInterface $file,
        ?string $dest = null,
        array $options = []
    ): ?PutResult {
        if (!$file) {
            return null;
        }

        if (!$file->getClientFilename()) {
            return null;
        }

        return $this->handleFile($file, $dest, $options);
    }

    public function getUploadPath(?string $path, string $ext = '', ?string $dir = null): string
    {
        if (!$path) {
            $path = $this->generateFileName() . '.{ext}';
        }

        $dir ??= $this->options['dir'];

        $path = $dir . '/' . $path;

        return Path::clean($path, '/');
    }

    /**
     * generateFileName
     *
     * @param  string  $prefix
     *
     * @return  string
     *
     * @throws \Exception
     */
    public function generateFileName(string $prefix = ''): string
    {
        return uid($prefix);
    }

    public function isImage(mixed $src): bool
    {
        $type = $this->getMimeType($src);

        return $type !== null && str_starts_with($type, 'image/');
    }

    protected function shouldResize(string $ext): bool
    {
        if ($this->options['raw_gif'] && strtolower($ext) === 'gif') {
            return false;
        }

        return $this->options['resize']['enabled'] || $this->options['force_redraw'];
    }

    public function resizeImage(
        StreamInterface|UploadedFileInterface $src,
        array $resizeConfig = []
    ): StreamInterface {
        $outputFormat = null;

        // Must sve image to temp file to support image exif.
        // @see https://github.com/Intervention/image/issues/745
        if ($src instanceof UploadedFileInterface) {
            $outputFormat = Path::getExtension($src->getClientFilename());

            $tmp = Filesystem::createTemp(WINDWALKER_TEMP . '/unicorn/upload');

            register_shutdown_function(fn() => Filesystem::delete($tmp->getPathname()));

            $src->moveTo($tmp->getPathname());
            $src = $tmp->getPathname();
        }

        $resizeConfig = array_merge(
            $this->options['resize'],
            $resizeConfig
        );

        $manager = new ImageManager(['driver' => $driver = $resizeConfig['driver']]);
        $image = $manager->make($src);

        if ($resizeConfig['orientate']) {
            try {
                $image->orientate();
            } catch (NotReadableException $e) {
                // No actions
            }
        }

        if ($driver === static::DRIVER_IMAGICK && $resizeConfig['strip_exif']) {
            $image->getCore()->stripImage();
        }

        $width = $resizeConfig['width'];
        $height = $resizeConfig['height'];

        if (!$resizeConfig['enabled']) {
            return $image->stream(null, $resizeConfig['quality']);
        }

        if (!$width || $image->width() >= $width || !$height || $image->height() >= $height) {
            if ($resizeConfig['crop']) {
                $image->fit($width, $height, function (Constraint $constraint) {
                    // $constraint->upsize();
                });
            } elseif ($width || $height) {
                $image->resize($width, $height, function (Constraint $constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }
        }

        return $image->stream(
            $resizeConfig['output_format'] ?? $outputFormat,
            $resizeConfig['quality']
        );
    }

    public function getMimeType(mixed $src): ?string
    {
        $type = null;

        if (is_string($src)) {
            if (Base64DataUri::isDataUri($src)) {
                $type = Base64DataUri::getMimeType($src);
            } elseif (strlen($src) < PHP_MAXPATHLEN && is_file($src)) {
                $type = $this->mimeTypes->getMimeTypes(Path::getExtension($src))[0] ?? null;
            }
        } elseif ($src instanceof UploadedFileInterface) {
            $type = $src->getClientMediaType();
        }

        return $type;
    }

    /**
     * getRealExtension
     *
     * @param  string  $ext
     *
     * @return  string
     */
    public static function normalizeExtension(string $ext): string
    {
        $ext = strtolower($ext);

        if ($ext === 'jpeg') {
            $ext = 'jpg';
        }

        return $ext;
    }

    public static function replaceVariables(string $dest, string $ext): string
    {
        $chronos = chronos();

        return strtr(
            $dest,
            [
                '{year}' => $chronos->format('Y'),
                '{month}' => $chronos->format('m'),
                '{day}' => $chronos->format('d'),
                '{hour}' => $chronos->format('H'),
                '{minute}' => $chronos->format('i'),
                '{second}' => $chronos->format('s'),
                '{ext}' => $ext,
            ]
        );
    }

    /**
     * throwUploadError
     *
     * @param  UploadedFileInterface  $file
     *
     * @return  void
     */
    protected function throwUploadError(UploadedFileInterface $file): void
    {
        $msg = 'Upload error: ' . UploadedFileHelper::getUploadMessage($file->getError());

        if ($file->getError() === UPLOAD_ERR_INI_SIZE) {
            $msg .= ' - The upload max file size is: ' . ini_get('upload_max_filesize');
        }

        if ($file->getError() === UPLOAD_ERR_FORM_SIZE) {
            $msg .= ' - The form post size is: ' . ini_get('post_max_size');
        }

        throw new FileUploadException(
            $msg,
            400,
            $file
        );
    }
}

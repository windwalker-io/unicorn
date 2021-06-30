<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Upload;

use Intervention\Image\Constraint;
use Intervention\Image\Exception\NotReadableException;
use Intervention\Image\Facades\Image;
use Intervention\Image\ImageManager;
use Intervention\Image\Size;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UploadedFileInterface;
use Symfony\Component\Mime\MimeTypeGuesserInterface;
use Symfony\Component\Mime\MimeTypesInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Unicorn\Flysystem\Base64DataUri;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\StorageInterface;
use Unicorn\Storage\StorageManager;
use Windwalker\Filesystem\Filesystem;
use Windwalker\Filesystem\Path;
use Windwalker\Http\Helper\UploadedFileHelper;
use Windwalker\Utilities\Options\OptionsResolverTrait;

use function Windwalker\uid;

/**
 * The FileUploadService class.
 */
class FileUploadService
{
    use OptionsResolverTrait;

    /**
     * FileUploadService constructor.
     */
    public function __construct(
        array $options,
        protected StorageManager $storageManager,
        protected MimeTypesInterface $mimeTypes
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
                            'width' => null,
                            'height' => null,
                            'crop' => false,
                            'quality' => 85,
                            'output_format' => null,
                        ]
                    );
                }
            );

        $resolver->define('dir')
            ->allowedTypes('string', 'null')
            ->default(null);

        $resolver->define('storage')
            ->allowedTypes('string', 'null')
            ->default('local');
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

        if (str_starts_with($mime, 'image/')) {
            $stream = $this->resizeImage($stream);
        }

        $dest ??= $this->getUploadPath(
            $dest,
            $this->mimeTypes->getExtensions($mime)[0] ?? null
        );

        return $storage->putStream($stream, $dest, $options);
    }

    public function handleFile(UploadedFileInterface $file, ?string $dest = null, array $options = []): PutResult
    {
        if ($file->getError() !== UPLOAD_ERR_OK) {
            throw new \RuntimeException(
                'Upload error: ' . UploadedFileHelper::getUploadMessage($file->getError()),
                400
            );
        }

        $storage = $this->getStorage();

        if ($this->isImage($file)) {
            $stream = $this->resizeImage($file);
        } else {
            $stream = $file->getStream();
        }

        $dest ??= $this->getUploadPath($dest, Path::getExtension($file->getClientFilename()));

        return $storage->putStream($stream, $dest, $options);
    }

    public function handleFileIfUploaded(?UploadedFileInterface $file, ?string $dest = null, array $options = []): ?PutResult
    {
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
            $path = $this->generateFileName() . '.' . ltrim($ext, '.');
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

    public function resizeImage(StreamInterface|UploadedFileInterface $src): StreamInterface
    {
        // Must sve image to temp file to support image exif.
        // @see https://github.com/Intervention/image/issues/745
        if ($src instanceof UploadedFileInterface) {
            $tmp = Filesystem::createTemp(WINDWALKER_TEMP . '/unicorn/upload');

            register_shutdown_function(fn () => Filesystem::delete($tmp->getPathname()));

            $src->moveTo($tmp->getPathname());
            $src = $tmp->getPathname();
        }

        $resizeConfig = $this->options['resize'];

        $manager = new ImageManager();
        $image = $manager->make($src);

        try {
            $image->orientate();
        } catch (NotReadableException $e) {
            // No actions
        }

        $width = $resizeConfig['width'];
        $height = $resizeConfig['height'];

        if (!$resizeConfig['enabled']) {
            return $image->stream();
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
            $resizeConfig['output_format'],
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
}

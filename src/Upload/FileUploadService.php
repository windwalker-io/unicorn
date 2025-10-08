<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Intervention\Image\Constraint;
use Intervention\Image\Exception\NotReadableException;
use Intervention\Image\FileExtension;
use Intervention\Image\Interfaces\ImageInterface;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UploadedFileInterface;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Symfony\Component\Mime\MimeTypesInterface;
use Unicorn\Flysystem\Base64DataUri;
use Unicorn\Image\InterventionImage;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\StorageInterface;
use Unicorn\Upload\Event\FileUploadedEvent;
use Unicorn\Upload\Exception\FileUploadException;
use Windwalker\Core\Event\CoreEventAwareTrait;
use Windwalker\Core\Manager\Logger;
use Windwalker\DI\Container;
use Windwalker\Event\EventAwareInterface;
use Windwalker\Filesystem\Filesystem;
use Windwalker\Filesystem\Path;
use Windwalker\Filesystem\TempFileObject;
use Windwalker\Http\Helper\UploadedFileHelper;
use Windwalker\Stream\Stream;
use Windwalker\Stream\StreamHelper;
use Windwalker\Stream\StringStream;
use Windwalker\Utilities\TypeCast;

use function Windwalker\chronos;
use function Windwalker\uid;

use const Windwalker\Stream\READ_ONLY_FROM_BEGIN;
use const Windwalker\Stream\READ_WRITE_RESET;

/**
 * The FileUploadService class.
 */
class FileUploadService implements EventAwareInterface
{
    use CoreEventAwareTrait;

    /**
     * @deprecated  Use FileUploadOptions::DRIVER_GD instead.
     */
    public const string DRIVER_GD = FileUploadOptions::DRIVER_GD;

    /**
     * @deprecated  Use FileUploadOptions::DRIVER_IMAGICK instead.
     */
    public const string DRIVER_IMAGICK = FileUploadOptions::DRIVER_IMAGICK;

    protected array $pathVars = [];

    public FileUploadOptions $options;

    /**
     * FileUploadService constructor.
     */
    public function __construct(
        protected Container $container,
        FileUploadOptions|array $options = new FileUploadOptions(),
        protected ?MimeTypesInterface $mimeTypes = null
    ) {
        $this->options = FileUploadOptions::wrapWith($options);
    }

    public function setResizeConfig(array|ResizeConfig $resizeConfig, bool $ignoreNulls = true): static
    {
        $this->options->resize = $this->options->withMerge(
            $resizeConfig,
            true,
            $ignoreNulls,
        );

        return $this;
    }

    public function getResizeConfig(): ResizeConfig
    {
        return $this->options->resize;
    }

    public function getStorage(): StorageInterface
    {
        return $this->container->get(StorageInterface::class, tag: $this->options->storage);
    }

    public function handleBase64(string $file, ?string $dest = null, array|FileUploadOptions $options = []): PutResult
    {
        $options = $this->getMergeOptions($options);
        $stream = Base64DataUri::toStream($file, $mime);

        $ext = $this->getExtensionByMimeType($mime);

        $dest ??= $this->getUploadPath($dest, $ext);
        $dest = $this->replaceVariables($dest, (string) $ext);
        $destExt = Path::getExtension($dest);

        if (str_starts_with($mime, 'image/') && $this->shouldRedraw($ext, $destExt)) {
            $resizeConfig = $options->resize;

            if ($destExt !== '{ext}') {
                $resizeConfig->outputFormat ??= $destExt;
            }

            $stream = $this->resizeImage($stream, $resizeConfig);
            $stream = $this->optimizeImage($stream, $dest, $resizeConfig);
        }

        return $this->putToStorage($stream, $file, $dest, $options);
    }

    public function handleFile(
        UploadedFileInterface|\SplFileInfo|string $file,
        ?string $dest = null,
        array|FileUploadOptions $options = []
    ): PutResult {
        if ($file instanceof \SplFileInfo) {
            $file = $file->getPathname();
        }

        $forceRedraw = false;

        if ($file instanceof UploadedFileInterface) {
            if ($file->getError() !== UPLOAD_ERR_OK) {
                $this->throwUploadError($file);
            }

            $srcExt = Path::getExtension($file->getClientFilename());

            // If uploaded file extension not equals to mime type,
            // Use extension as final output format.
            $forceRedraw = $this->getExtensionByMimeType($file->getClientMediaType()) !== $srcExt;
        } else {
            if (Path::isURL($file)) {
                throw new \InvalidArgumentException('Cannot upload file from URL');
            }

            $srcExt = Path::getExtension($file);
        }

        $dest ??= $this->getUploadPath($dest, $srcExt);

        $destExt = Path::getExtension($dest);
        $options = $this->getMergeOptions($options);

        if ($this->isImage($file) && ($forceRedraw || $this->shouldRedraw($srcExt, $destExt))) {
            $resizeConfig = $options->resize;

            // Todo: Should refactor total process
            $dest = $this->replaceVariables($dest, $resizeConfig->outputFormat ?? $srcExt);

            if ($destExt !== '{ext}') {
                $resizeConfig->outputFormat ??= $destExt;
            } elseif ($forceRedraw) {
                $resizeConfig->outputFormat ??= $srcExt;
            }

            $stream = $this->resizeImage($file, $resizeConfig);
            $stream = $this->optimizeImage($stream, $dest, $resizeConfig);
        } elseif ($file instanceof UploadedFileInterface) {
            $dest = $this->replaceVariables($dest, $srcExt);
            $stream = $file->getStream();
        } else {
            $dest = $this->replaceVariables($dest, $srcExt);
            $stream = new Stream($file, READ_ONLY_FROM_BEGIN);
        }

        return $this->putToStorage($stream, $file, $dest, $options);
    }

    public function handleFileIfUploaded(
        ?UploadedFileInterface $file,
        ?string $dest = null,
        array|FileUploadOptions $options = []
    ): ?PutResult {
        if (!$file) {
            return null;
        }

        if (!$file->getClientFilename()) {
            return null;
        }

        return $this->handleFile($file, $dest, $options);
    }

    /**
     * @param  resource|StreamInterface|string  $file
     * @param  string|null                      $dest
     * @param  array|FileUploadOptions          $options
     *
     * @return  PutResult
     * @throws \Exception
     */
    public function handleFileData(
        mixed $file,
        ?string $dest = null,
        array|FileUploadOptions $options = []
    ): PutResult {
        if (is_resource($file)) {
            $stream = Stream::wrap($file);

            $dest ??= $this->getUploadPath($dest);

            $ext = Path::getExtension((string) $dest);

            $mime = $this->getMimeTypeByExtension($dest);
        } elseif (is_string($file)) {
            $stream = StringStream::fromString($file);

            $ext = Path::getExtension($dest);
            $dest ??= $this->getUploadPath($dest, $ext);

            $mime = $this->getMimeType($file);
        } elseif ($file instanceof StreamInterface) {
            $stream = $file;

            $dest ??= $this->getUploadPath($dest);
            $ext = Path::getExtension((string) $dest);

            $mime = $this->getMimeTypeByExtension($dest);
        } else {
            throw new \InvalidArgumentException(
                __METHOD__ . '() argument 1 should be StreamInterface|resource|string.'
            );
        }

        $dest = $this->replaceVariables($dest, $ext);
        $destExt = Path::getExtension($dest);

        if (str_starts_with((string) $mime, 'image/') && $this->shouldRedraw($ext, $destExt)) {
            $resizeConfig = $this->getMergedResizeConfig($options);

            if ($destExt !== '{ext}') {
                $resizeConfig->outputFormat ??= $destExt;
            }

            $stream = $this->resizeImage($stream, $resizeConfig);
            $stream = $this->optimizeImage($stream, $dest, $resizeConfig);
        }

        return $this->putToStorage($stream, $file, $dest, $options);
    }

    public function getUploadPath(?string $path, string $ext = '', ?string $dir = null): string
    {
        if (!$path) {
            $path = $this->generateFileName() . '.{ext}';
        }

        $dir ??= $this->options->dir;

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

    public function isImage(UploadedFileInterface|\SplFileInfo|string $src): bool
    {
        $type = $this->getMimeType($src);

        return $type !== null && str_starts_with($type, 'image/');
    }

    protected function shouldRedraw(string $ext, string $destExt): bool
    {
        if ($destExt !== '{ext}' && $ext !== $destExt) {
            return true;
        }

        if ($this->options->rawGif && strtolower($ext) === 'gif') {
            return false;
        }

        return $this->options->resize->enabled || $this->options->forceRedraw;
    }

    /**
     * @param  StreamInterface|\SplFileInfo|string|UploadedFileInterface  $src
     * @param  array|ResizeConfig                                         $resizeConfig
     *
     * @return  StreamInterface
     */
    public function resizeImage(
        StreamInterface|\SplFileInfo|string|UploadedFileInterface $src,
        array|ResizeConfig $resizeConfig = []
    ): StreamInterface {
        $outputFormat = null;

        if (is_string($src)) {
            $src = new Stream($src, READ_ONLY_FROM_BEGIN);
        } elseif ($src instanceof \SplFileInfo) {
            $src = new Stream($src->getPathname(), READ_ONLY_FROM_BEGIN);
        }

        // Must save image to temp file to support image exif.
        // @see https://github.com/Intervention/image/issues/745
        if ($src instanceof UploadedFileInterface) {
            $outputFormat = Path::getExtension($src->getClientFilename());

            $tmp = Filesystem::createTemp(WINDWALKER_TEMP . '/unicorn/upload');

            register_shutdown_function(fn() => Filesystem::delete($tmp->getPathname()));

            $src->moveTo($tmp->getPathname());
            $src = $tmp->getPathname();
        }

        $resizeConfig = $this->options->resize->withMerge($resizeConfig, true, true);

        $interventionVersion = InterventionImage::version();

        return $interventionVersion === 2
            ? $this->resizeByIntervension2($src, $resizeConfig, $outputFormat)
            : $this->resizeByIntervension3($src, $resizeConfig, $outputFormat);
    }

    /**
     * @param  StreamInterface     $src
     * @param  string              $dest
     * @param  ResizeConfig|array  $resizeConfig
     *
     * @return  StreamInterface
     * @throws \Exception
     */
    public function optimizeImage(
        StreamInterface $src,
        string $dest,
        ResizeConfig|array $resizeConfig
    ): StreamInterface {
        $resizeConfig = ResizeConfig::wrapWith($resizeConfig);

        $optimize = $resizeConfig->stripExif ?: $this->options->optimize;

        if ($optimize === false) {
            return $src;
        }

        if (!class_exists(OptimizerChainFactory::class)) {
            throw new \DomainException('Please install `spatie/image-optimizer` first.');
        }

        $options = [];

        if (is_array($optimize)) {
            $options = $optimize;
        }

        $optimizer = OptimizerChainFactory::create($options);
        $logger = Logger::getChannel('image-optimizer');

        if ($logger) {
            $optimizer->useLogger($logger);
        }

        $tmpDir = WINDWALKER_TEMP . '/images/';
        Filesystem::mkdir($tmpDir);

        $ext = Path::getExtension($dest);
        $filename = uid();
        $tmp = $tmpDir . $filename . '.' . $ext;
        $tmpFile = new TempFileObject($tmp);
        $tmpFile->deleteWhenDestruct(true);
        $tmpFile->touch();

        StreamHelper::copy($src, $tmpFile->getStream());

        $tmp = $tmpDir . $filename . '.new.' . $ext;
        $newFile = new TempFileObject($tmp);
        $newFile->deleteWhenDestruct(true);
        $newFile->touch();

        $optimizer->optimize($tmpFile->getPathname(), $newFile->getPathname());

        $newImage = new Stream('php://memory', READ_WRITE_RESET);
        StreamHelper::copy($newFile->getStream(), $newImage);
        $newImage->rewind();

        return $newImage;
    }

    protected function resizeByIntervension3(
        StreamInterface|\SplFileInfo|string|UploadedFileInterface $src,
        array|ResizeConfig $resizeConfig,
        ?string $outputFormat
    ): StreamInterface {
        $resizeConfig = ResizeConfig::wrapWith($resizeConfig);

        // $optimize = $resizeConfig['strip_exif'] || $this->options['optimize'];

        $image = InterventionImage::read($src, $resizeConfig->driver);

        $width = TypeCast::safeInteger($resizeConfig->width);
        $height = TypeCast::safeInteger($resizeConfig->height);

        if (!$resizeConfig->enabled) {
            return Stream::wrap(
                $this->encodeImageByExtension(
                    $image,
                    $resizeConfig->outputFormat ?? $outputFormat,
                    TypeCast::safeInteger($resizeConfig->quality ?? 85)
                ),
            );
        }

        if ($resizeConfig->crop && $width !== null && $height !== null) {
            $image->coverDown($width, $height);
        } elseif ($width || $height) {
            $image->scaleDown($width, $height);
        }

        // if ($optimize && $outputFormat === 'png') {
        //     $colors = is_int($this->options['optimize']) ? $this->options['optimize'] : 2048;
        //
        //     $image->reduceColors($colors);
        // }

        $res = $this->encodeImageByExtension(
            $image,
            $resizeConfig->outputFormat ?? $outputFormat,
            TypeCast::safeInteger($resizeConfig->quality ?? 85)
        );

        return Stream::wrap($res);
    }

    protected function encodeImageByExtension(
        ImageInterface $image,
        mixed $format,
        int $quality
    ) {
        $format ??= 'jpg';

        $format = strtolower($format);

        $extension = FileExtension::from($format);

        if ($extension === FileExtension::PNG) {
            $encoded = $image->encodeByExtension($format);
        } else {
            $encoded = $image->encodeByExtension($format, $quality);
        }

        return $encoded->toFilePointer();
    }

    /**
     * @deprecated
     */
    protected function resizeByIntervension2(
        StreamInterface|\SplFileInfo|string|UploadedFileInterface $src,
        array|ResizeConfig $resizeConfig,
        ?string $outputFormat
    ): StreamInterface {
        $resizeConfig = ResizeConfig::wrapWith($resizeConfig, true, true);

        $image = InterventionImage::read($src, $driver = $resizeConfig->driver);

        if ($resizeConfig->orientate) {
            try {
                $image->orientate();
            } catch (NotReadableException $e) {
                // No actions
            }
        }

        if ($driver === static::DRIVER_IMAGICK && $resizeConfig->stripExif) {
            $image->getCore()->stripImage();
        }

        $width = $resizeConfig->width;
        $height = $resizeConfig->height;

        if (!$resizeConfig->enabled) {
            return $image->stream(
                $resizeConfig->outputFormat ?? $outputFormat,
                TypeCast::safeInteger($resizeConfig->quality)
            );
        }

        if (!$width || $image->width() >= $width || !$height || $image->height() >= $height) {
            if ($resizeConfig->crop) {
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
            $resizeConfig->outputFormat ?? $outputFormat,
            TypeCast::safeInteger($resizeConfig->quality)
        );
    }

    protected function getMergeOptions(FileUploadOptions|array $options): FileUploadOptions
    {
        return $this->options->withMerge($options, true, true);
    }

    protected function getMergedResizeConfig(FileUploadOptions $options): ResizeConfig
    {
        return $this->getMergeOptions($options)->resize;
    }

    public function getMimeType(UploadedFileInterface|\SplFileInfo|string $src): ?string
    {
        $type = null;

        if ($src instanceof \SplFileInfo) {
            $src = $src->getPathname();
        }

        if (is_string($src)) {
            if (Base64DataUri::isDataUri($src)) {
                $type = Base64DataUri::getMimeType($src);
            } elseif (strlen($src) < PHP_MAXPATHLEN && is_file($src)) {
                $type = $this->getMimeTypeByExtension(Path::getExtension($src));
            }
        } elseif ($src instanceof UploadedFileInterface) {
            $type = $src->getClientMediaType();
        }

        return $type;
    }

    public function getMimeTypeByExtension(string $pathOrExt): ?string
    {
        if (str_contains($pathOrExt, '.')) {
            $pathOrExt = Path::getExtension($pathOrExt);
        }

        return $this->mimeTypes->getMimeTypes($pathOrExt)[0] ?? null;
    }

    public function getExtensionByMimeType(string $mime): ?string
    {
        return $this->getMimeTypeFinder()->getExtensions($mime)[0] ?? null;
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

    public function replaceVariables(string $dest, string $ext): string
    {
        $chronos = chronos();

        $vars = array_map(
            static fn(string $var) => "{{$var}}",
            $this->pathVars
        );

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
                ...$vars,
            ],
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

    /**
     * @param  StreamInterface          $stream
     * @param  mixed                    $file
     * @param  string                   $dest
     * @param  FileUploadOptions|array  $options
     *
     * @return  PutResult
     */
    protected function putToStorage(
        StreamInterface $stream,
        mixed $file,
        string $dest,
        FileUploadOptions|array $options
    ): PutResult {
        $storageOptions = array_merge($this->options->storageOptions, $options->storageOptions);

        $storage = $this->getStorage();
        $result = $storage->putStream($stream, $dest, $storageOptions);

        $event = $this->emit(
            new FileUploadedEvent(
                file: $file,
                result: $result,
                stream: $stream,
                options: $options,
                dest: $dest
            )
        );

        return $event->result;
    }

    /**
     * @return  MimeTypesInterface
     */
    protected function getMimeTypeFinder(): MimeTypesInterface
    {
        if (!interface_exists(MimeTypesInterface::class)) {
            throw new \DomainException('Please install symfony/mime to support file upload.');
        }

        return $this->mimeTypes;
    }

    public function setPathVar(string $name, mixed $value): static
    {
        $this->pathVars[$name] = (string) $value;

        return $this;
    }

    public function getPathVar(string $name): ?string
    {
        return $this->pathVars[$name] ?? null;
    }

    public function removePathVar(string $name): static
    {
        unset($this->pathVars[$name]);

        return $this;
    }

    public function getPathVars(): array
    {
        return $this->pathVars;
    }

    public function setPathVars(array $pathVars): static
    {
        $this->pathVars = $pathVars;

        return $this;
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UploadedFileInterface;
use Symfony\Component\Mime\MimeTypesInterface;
use Unicorn\Flysystem\Base64DataUri;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\StorageInterface;
use Unicorn\Upload\Event\FileUploadedEvent;
use Unicorn\Upload\Exception\FileUploadException;
use Windwalker\Core\Event\CoreEventAwareTrait;
use Windwalker\DI\Container;
use Windwalker\Event\EventAwareInterface;
use Windwalker\Filesystem\Path;
use Windwalker\Http\FullPathAwareInterface;
use Windwalker\Http\Helper\UploadedFileHelper;
use Windwalker\Stream\Stream;
use Windwalker\Stream\StringStream;

use function Windwalker\chronos;
use function Windwalker\uid;

use const Windwalker\Stream\READ_ONLY_FROM_BEGIN;

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

    protected const array DANGEROUS_EXTENSIONS = [
        'php', 'phtml', 'phar', 'pht', 'phps',
        'html', 'htm', 'xhtml', 'shtml', 'xht',
        'css', 'js', 'mjs',
        'asp', 'aspx', 'ashx', 'asmx', 'jsp', 'jspx', 'cfm', 'cgi', 'pl', 'py', 'rb',
        'sh', 'bash', 'zsh', 'bat', 'cmd', 'ps1', 'vbs', 'wsf',
        'exe', 'dll', 'com', 'msi', 'jar', 'war', 'htaccess', 'htpasswd',
    ];

    protected array $pathVars = [];

    public FileUploadOptions $options;

    /**
     * FileUploadService constructor.
     */
    public function __construct(
        protected Container $container,
        protected ImageRedrawProcessor $imageProcessor,
        FileUploadOptions|array $options = new FileUploadOptions(),
        protected ?MimeTypesInterface $mimeTypes = null
    ) {
        $this->options = FileUploadOptions::wrapWith($options);
    }

    public function setResizeConfig(array|ResizeConfig $resizeConfig, bool $ignoreNulls = true): static
    {
        $this->options->resize = $this->options->resize->withMerge(
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
        $dest = $this->replaceVariables($dest, ext: $ext);
        $destExt = Path::getExtension($dest);

        if (str_starts_with($mime, 'image/') && $this->shouldRedraw($ext, $destExt)) {
            $resizeConfig = $options->resize;

            if ($destExt !== '{ext}') {
                $resizeConfig->outputFormat ??= $destExt;
            }

            $stream = $this->redrawImage($stream, $dest, $resizeConfig);
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
        $folder = null;

        if ($file instanceof UploadedFileInterface) {
            if ($file->getError() !== UPLOAD_ERR_OK) {
                $this->throwUploadError($file);
            }

            $srcExt = Path::getExtension($file->getClientFilename());
            $basename = Path::basename($file->getClientFilename(), true);

            if ($file instanceof FullPathAwareInterface && $file->getFullPath()) {
                $folder = dirname($file->getFullPath());
            }

            // If uploaded file extension not equals to mime type,
            // Use extension as final output format.
            $forceRedraw = $this->getExtensionByMimeType($file->getClientMediaType()) !== $srcExt;
        } else {
            if (Path::isURL($file)) {
                throw new \InvalidArgumentException('Cannot upload file from URL');
            }

            $srcExt = Path::getExtension($file);
            $basename = Path::basename($file, true);
        }

        $dest ??= $this->getUploadPath($dest, $srcExt);

        $destExt = Path::getExtension($dest);
        $options = $this->getMergeOptions($options);

        if (
            $this->isImage($file)
            && !$this->isSvgPassthrough($srcExt, $destExt)
            && ($forceRedraw || $this->shouldRedraw($srcExt, $destExt))
        ) {
            $resizeConfig = $options->resize;

            // Todo: Should refactor total process
            $dest = $this->replaceVariables(
                $dest,
                folder: $folder,
                basename: $basename,
                ext: $resizeConfig->outputFormat ?? $srcExt
            );

            if ($destExt !== '{ext}') {
                $resizeConfig->outputFormat ??= $destExt;
            } elseif ($forceRedraw) {
                $resizeConfig->outputFormat ??= $srcExt;
            }

            $stream = $this->redrawImage($file, $dest, $resizeConfig);
        } elseif ($file instanceof UploadedFileInterface) {
            $dest = $this->replaceVariables(
                $dest,
                folder: $folder,
                basename: $basename,
                ext: $srcExt
            );
            $stream = $file->getStream();
        } else {
            $dest = $this->replaceVariables(
                $dest,
                folder: $folder,
                basename: $basename,
                ext: $srcExt
            );
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
     * @throws  \Exception
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

        $dest = $this->replaceVariables($dest, ext: $ext);
        $destExt = Path::getExtension($dest);

        if (str_starts_with((string) $mime, 'image/') && $this->shouldRedraw($ext, $destExt)) {
            $resizeConfig = $this->getMergedResizeConfig($options);

            if ($destExt !== '{ext}') {
                $resizeConfig->outputFormat ??= $destExt;
            }

            $stream = $this->redrawImage($stream, $dest, $resizeConfig);
        }

        $options = $this->getMergeOptions($options);

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
     * @throws  \Exception
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

    /**
     * SVG is vector XML which cannot be redrawn by GD, and is sanitized in putToStorage() instead.
     */
    protected function isSvgPassthrough(string $ext, string $destExt): bool
    {
        return strtolower($ext) === 'svg' && in_array(strtolower($destExt), ['svg', '{ext}'], true);
    }

    protected function shouldRedraw(string $ext, string $destExt): bool
    {
        if ($destExt !== '{ext}' && $ext !== $destExt) {
            return true;
        }

        if ($this->options->rawGif && strtolower($ext) === 'gif') {
            return false;
        }

        if ($this->isSvgPassthrough($ext, $destExt)) {
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
        $resizeConfig = $this->options->resize->withMerge($resizeConfig, true, true);

        return $this->imageProcessor->resize($src, $resizeConfig);
    }

    /**
     * Resize (or re-encode) the image, then optimize it, using the service's merged resize config.
     */
    protected function redrawImage(
        StreamInterface|\SplFileInfo|string|UploadedFileInterface $src,
        string $dest,
        ResizeConfig|array $resizeConfig
    ): StreamInterface {
        $resizeConfig = $this->options->resize->withMerge($resizeConfig, true, true);

        return $this->imageProcessor->redraw($src, $dest, $resizeConfig, $this->options->optimize);
    }

    /**
     * @param  StreamInterface     $src
     * @param  string              $dest
     * @param  ResizeConfig|array  $resizeConfig  Unused. `stripExif` is deprecated and has no effect.
     *
     * @return  StreamInterface
     * @throws  \Exception
     */
    public function optimizeImage(
        StreamInterface $src,
        string $dest,
        ResizeConfig|array $resizeConfig
    ): StreamInterface {
        return $this->imageProcessor->optimize($src, $dest, $this->options->optimize);
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

    public function replaceVariables(
        string $dest,
        ?string $folder = null,
        ?string $basename = null,
        ?string $ext = null,
    ): string {
        $chronos = chronos();

        $vars = [];

        foreach ($this->pathVars as $name => $value) {
            $vars['{' . $name . '}'] = $value;
        }

        if ($folder !== null) {
            $vars['{folder}'] = $folder === '.' ? '' : $folder;
        }

        if ($basename !== null) {
            $vars['{basename}'] = $basename;
        }

        if ($ext !== null) {
            $vars['{ext}'] = $ext;
        }

        if ($basename !== null && $ext !== null) {
            $vars['{filename}'] = $basename . '.' . $ext;
        }

        return strtr(
            $dest,
            [
                '{year}' => $chronos->format('Y'),
                '{month}' => $chronos->format('m'),
                '{day}' => $chronos->format('d'),
                '{hour}' => $chronos->format('H'),
                '{minute}' => $chronos->format('i'),
                '{second}' => $chronos->format('s'),
                '{timestamp}' => (string) $chronos->getTimestamp(),
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
        FileUploadOptions $options
    ): PutResult {
        $this->assertSafeDestination($dest);
        $this->assertAccepted($dest, $options);

        // SVG is never redrawn, so sanitize it here unless disabled, and minify it if optimize is enabled.
        if ($options->sanitizeSvg && strtolower(Path::getExtension($dest)) === 'svg') {
            $stream = $this->imageProcessor->sanitizeSvg($stream, $options->optimize !== false);
        }

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
     * Reject destinations that could escape the storage root.
     */
    protected function assertSafeDestination(string $dest): void
    {
        if (str_contains($dest, "\0")) {
            throw new \InvalidArgumentException('Invalid upload destination.', 400);
        }

        foreach (preg_split('#[\\\\/]+#', $dest) as $segment) {
            if ($segment === '..') {
                throw new \InvalidArgumentException('Invalid upload destination.', 400);
            }
        }
    }

    /**
     * Validate the final extension, and the mime types mapped from that extension (not the client-provided one),
     * against `acceptExtensions` and `acceptMimeTypes`. A null or empty list skips that check.
     */
    protected function assertAccepted(string $dest, FileUploadOptions $options): void
    {
        $extensions = array_filter(
            array_map(
                static fn($ext) => static::normalizeExtension(ltrim(trim((string) $ext), '.')),
                $options->acceptExtensions ?? []
            )
        );
        $mimeTypes = array_filter(
            array_map(static fn($mime) => strtolower(trim((string) $mime)), $options->acceptMimeTypes ?? [])
        );

        if ($extensions !== []) {
            $ext = static::normalizeExtension(Path::getExtension($dest));

            if (!in_array($ext, $extensions, true)) {
                throw new \DomainException('File extension is not allowed.', 400);
            }
        } else {
            $this->assertNotDangerousExtension($dest);
        }

        if ($mimeTypes !== []) {
            $detected = array_map(
                'strtolower',
                $this->getMimeTypeFinder()->getMimeTypes(Path::getExtension($dest))
            );

            foreach ($mimeTypes as $accepted) {
                foreach ($detected as $mime) {
                    if ($accepted === '*/*' || $accepted === $mime) {
                        return;
                    }

                    if (str_ends_with($accepted, '/*') && str_starts_with($mime, substr($accepted, 0, -1))) {
                        return;
                    }
                }
            }

            throw new \DomainException('File type is not allowed.', 400);
        }
    }

    /**
     * Executable / active content extensions blocked when `acceptExtensions` is not configured.
     * Every dot-separated segment of the file name is checked to catch names like `shell.php.jpg`.
     */
    protected function assertNotDangerousExtension(string $dest): void
    {
        $segments = array_slice(explode('.', strtolower(Path::basename($dest))), 1);

        foreach ($segments as $segment) {
            if (in_array($segment, static::DANGEROUS_EXTENSIONS, true) || preg_match('/^php\d*$/', $segment)) {
                throw new \DomainException('File extension is not allowed.', 400);
            }
        }
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

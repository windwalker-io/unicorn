<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\FileExtension;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\ImageInterface;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UploadedFileInterface;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Unicorn\Image\Decoder\PsrStreamGdDecoder;
use Unicorn\Image\Decoder\PsrStreamImagickDecoder;
use Windwalker\Core\Manager\Logger;
use Windwalker\Filesystem\Filesystem;
use Windwalker\Filesystem\Path;
use Windwalker\Filesystem\TempFileObject;
use Windwalker\Stream\Stream;
use Windwalker\Stream\StreamHelper;
use Windwalker\Utilities\TypeCast;

use function Windwalker\uid;

use const Windwalker\Stream\READ_ONLY_FROM_BEGIN;
use const Windwalker\Stream\READ_WRITE_RESET;

/**
 * @psalm-type OptimizeOptions = bool|int|array{quality?: int}|array<class-string, list<string>>
 *
 * Handles image resize, redraw (re-encode) and optimization.
 */
class ImageRedrawProcessor
{
    public function __construct(protected ?string $tempPath = null)
    {
        $this->tempPath ??= sys_get_temp_dir();
    }

    /**
     * Resize (or re-encode) the image, then optimize the result.
     *
     * @param  OptimizeOptions  $optimizeOptions  `false` skips optimization; `true` or an int runs the default chain.
     *                                            `quality` sets the default quality. Keys as optimizer classes
     *                                            (e.g. `Jpegoptim::class`)
     *                                            replace the default chain with the given CLI arguments.
     */
    public function redraw(
        StreamInterface|\SplFileInfo|string|UploadedFileInterface $src,
        string $dest,
        ResizeConfig $resizeConfig,
        bool|int|array $optimizeOptions = false
    ): StreamInterface {
        $stream = $this->resize($src, $resizeConfig);

        return $this->optimize($stream, $dest, $optimizeOptions);
    }

    /**
     * @param  StreamInterface|\SplFileInfo|string|UploadedFileInterface  $src
     *
     * @return  StreamInterface
     */
    public function resize(
        StreamInterface|\SplFileInfo|string|UploadedFileInterface $src,
        ResizeConfig $resizeConfig
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

            $tmp = Filesystem::createTemp(rtrim($this->tempPath, '/\\') . '/resize/');

            register_shutdown_function(fn() => Filesystem::delete($tmp->getPathname()));

            $src->moveTo($tmp->getPathname());
            $src = $tmp->getPathname();
        }

        return $this->resizeWithIntervention($src, $resizeConfig, $outputFormat);
    }

    /**
     * @param  StreamInterface  $src
     * @param  string           $dest
     * @param  OptimizeOptions  $optimizeOptions  `false` skips optimization; `true` or an int runs the default chain.
     *                                            `quality` sets the default quality. Keys as optimizer classes
     *                                            (e.g. `Jpegoptim::class`)
     *                                            replace the default chain with the given CLI arguments.
     *
     * @return  StreamInterface
     * @throws  \Exception
     */
    public function optimize(
        StreamInterface $src,
        string $dest,
        bool|int|array $optimizeOptions = false
    ): StreamInterface {
        if ($optimizeOptions === false) {
            return $src;
        }

        if (!class_exists(OptimizerChainFactory::class)) {
            throw new \DomainException('Please install `spatie/image-optimizer` first.');
        }

        $options = [];

        if (is_array($optimizeOptions)) {
            $options = $optimizeOptions;
        }

        $optimizer = OptimizerChainFactory::create($options);
        $logger = Logger::getChannel('image-optimizer');

        if ($logger) {
            $optimizer->useLogger($logger);
        }

        $tmpDir = rtrim($this->tempPath, '/\\') . '/optimize/';
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

    /**
     * Overridable seam for reading an image through Intervention.
     */
    protected function readImage(mixed $src, string $driver): ImageInterface
    {
        $driverClass = match ($driver) {
            'gd' => GdDriver::class,
            'imagick' => ImagickDriver::class,
            default => $driver
        };

        $manager = new ImageManager($driverClass);

        if ($src instanceof StreamInterface) {
            return $manager->decode(
                $src,
                $manager->driver->id() === 'GD'
                    ? PsrStreamGdDecoder::class
                    : PsrStreamImagickDecoder::class
            );
        }

        return $manager->decode($src);
    }

    protected function resizeWithIntervention(
        StreamInterface|\SplFileInfo|string|UploadedFileInterface $src,
        ResizeConfig $resizeConfig,
        ?string $outputFormat
    ): StreamInterface {
        $image = $this->readImage($src, $resizeConfig->driver);

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

        $res = $this->encodeImageByExtension(
            $image,
            $resizeConfig->outputFormat ?? $outputFormat,
            TypeCast::safeInteger($resizeConfig->quality ?? 85)
        );

        return Stream::wrap($res);
    }

    /**
     * @return  resource
     */
    protected function encodeImageByExtension(
        ImageInterface $image,
        mixed $format,
        int $quality
    ) {
        $format ??= 'jpg';

        $format = strtolower($format);

        $extension = FileExtension::from($format);

        if ($extension === FileExtension::PNG) {
            $encoded = $image->encodeUsingFileExtension($format);
        } else {
            $encoded = $image->encodeUsingFileExtension($format, quality: $quality);
        }

        return $encoded->toStream();
    }
}

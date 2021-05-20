<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Flysystem;

use Psr\Http\Message\StreamInterface;
use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Mime\MimeTypesInterface;
use Windwalker\Filesystem\FileObject;
use Windwalker\Filesystem\Filesystem;
use Windwalker\Filesystem\Path;
use Windwalker\Stream\Stream;

/**
 * The Base64Data class.
 */
class Base64DataUri
{
    public static function isDataUri(string $data): bool
    {
        return str_starts_with($data, 'data:');
    }

    /**
     * decode
     *
     * @param  string       $base64
     * @param  string|null  $mime
     *
     * @return  string
     */
    public static function decode(string $base64, ?string &$mime = null): string
    {
        preg_match('/data:(\w+\/\w+);base64,(.*)/', $base64, $matches);

        $mime = $matches[1];
        $code = $matches[2];

        return base64_decode($code);
    }

    public static function toStream(string $base64, ?string &$mime = null): StreamInterface
    {
        $data = static::decode($base64, $mime);

        $stream = new Stream('php://memory', Stream::MODE_READ_WRITE_RESET);
        $stream->write($data);
        $stream->rewind();

        return $stream;
    }

    /**
     * encode
     *
     * @param string  $data
     * @param string  $mime
     *
     * @return  string
     */
    public static function encode(string $data, string $mime): string
    {
        return 'data:' . $mime . ';base64,' . base64_encode($data);
    }

    /**
     * toFile
     *
     * @param  string  $base64
     * @param  string  $dest
     *
     * @return FileObject
     */
    public static function toFile(string $base64, string $dest): FileObject
    {
        return Filesystem::write($dest, static::decode($base64));
    }

    /**
     * loadFile
     *
     * @param  string       $file
     * @param  string|null  $mime
     *
     * @return  string
     */
    public static function fromFile(string $file, string|MimeTypesInterface|null $mime = null): string
    {
        if (!is_file($file)) {
            throw new \RuntimeException('File not found.');
        }

        $image = file_get_contents($file);

        if ($mime instanceof MimeTypesInterface) {
            $mime = $mime->getMimeTypes(Path::getExtension($file))[0] ?? null;
        } elseif ($mime === null) {
            $mimeType = new MimeTypes();
            $mime = $mimeType->getMimeTypes(Path::getExtension($file))[0] ?? null;
        }

        return static::encode($image, $mime);
    }

    /**
     * getType
     *
     * @param  string  $base64
     *
     * @return string|null
     */
    public static function getMimeType(string $base64): ?string
    {
        preg_match('/data:(\w+\/\w+);/', $base64, $matches);

        return $matches[1] ?? null;
    }
}

<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Storage;

use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Windwalker\Filesystem\FileObject;

/**
 * Interface StorageInterface
 */
interface StorageInterface
{
    public function put(string $data, string $path, array $options = []): PutResult;

    public function putFile(string $src, string $path, array $options = []): PutResult;

    /**
     * putStream
     *
     * @param  StreamInterface|resource  $src
     * @param  string                    $path
     * @param  array                     $options
     *
     * @return  PutResult
     */
    public function putStream(mixed $src, string $path, array $options = []): PutResult;

    public function delete(string $path, array $options = []): bool;

    public function getUri(string $path, array $options = []): UriInterface;

    public function get(string $path, array $options = []): FileObject;

    public function read(string $path, array $options = []): string;

    public function readStream(string $path, array $options = []): StreamInterface;

    public function listContents(string $path, bool $recursive = false): iterable;

    public function exists(string $path): bool;
}

<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Storage\Adapter;

use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Unicorn\Aws\S3Service;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\StorageInterface;
use Windwalker\Filesystem\FileObject;

/**
 * The S3Adapter class.
 */
class S3Storage implements StorageInterface
{
    /**
     * S3Storage constructor.
     */
    public function __construct(protected S3Service $s3)
    {
    }

    public function put(string $data, string $path, array $options = []): PutResult
    {
        $this->s3->uploadFileData(
            $data,
            $path,
            [
                'ACL'
            ]
        );
    }

    public function putFile(string $src, string $path, array $options = []): PutResult
    {
    }

    public function putStream(mixed $src, string $path, array $options = []): PutResult
    {
    }

    public function delete(string $path, array $options = []): bool
    {
    }

    public function getUri(string $path, array $options = []): UriInterface
    {
    }

    public function get(string $path, array $options = []): FileObject
    {
    }

    public function read(string $path, array $options = []): string
    {
    }

    public function readStream(string $path, array $options = []): StreamInterface
    {
    }

    public function listContents(string $path, bool $recursive = false): iterable
    {
    }

    public function exists(string $path): bool
    {
    }

    /**
     * @return S3Service
     */
    public function getS3Service(): S3Service
    {
        return $this->s3;
    }
}

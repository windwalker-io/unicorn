<?php

declare(strict_types=1);

namespace Unicorn\Storage\Adapter;

use League\Flysystem\Filesystem;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Unicorn\Storage\GetResult;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\Result;
use Unicorn\Storage\StorageInterface;
use Windwalker\Filesystem\FileObject;

/**
 * The FlysystemStorage class.
 *
 * // todo: implement Flysystem storage
 */
class FlysystemStorage implements StorageInterface
{
    /**
     * FlysystemStorage constructor.
     */
    public function __construct(protected Filesystem $filesystem)
    {
    }

    public function put(string $data, string $path, array $options = []): PutResult
    {
    }

    public function putFile(string $src, string $path, array $options = []): PutResult
    {
    }

    public function putStream(mixed $src, string $path, array $options = []): PutResult
    {
    }

    public function delete(string $path, array $options = []): Result
    {
    }

    public function getUri(string $path, array $options = []): UriInterface
    {
    }

    public function get(string $path, array $options = []): GetResult
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
     * @return Filesystem
     */
    public function getFilesystem(): Filesystem
    {
        return $this->filesystem;
    }

    /**
     * @param  Filesystem  $filesystem
     *
     * @return  static  Return self to support chaining.
     */
    public function setFilesystem(Filesystem $filesystem): static
    {
        $this->filesystem = $filesystem;

        return $this;
    }
}

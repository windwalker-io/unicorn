<?php

declare(strict_types=1);

namespace Unicorn\Storage\Adapter;

use League\Flysystem\FileAttributes;
use League\Flysystem\Filesystem;
use League\Flysystem\StorageAttributes;
use League\Flysystem\UnableToGeneratePublicUrl;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Unicorn\Storage\GetResult;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\Result;
use Unicorn\Storage\StorageInterface;
use Windwalker\Http\Response\Response;
use Windwalker\Stream\Stream;
use Windwalker\Uri\Uri;

/**
 * The FlysystemStorage class.
 *
 * Adapts a League Flysystem v3 filesystem to StorageInterface. Options are passed to Flysystem as write config,
 * and `mime_type` is mapped to Flysystem's `mimetype` config.
 */
class FlysystemStorage implements StorageInterface
{
    /**
     * FlysystemStorage constructor.
     */
    public function __construct(protected Filesystem $filesystem) {}

    public function put(string $data, string $path, array $options = []): PutResult
    {
        $this->filesystem->write($path, $data, $this->createConfig($options));

        return $this->createPutResult($path, strlen($data), $options);
    }

    public function putFile(string $src, string $path, array $options = []): PutResult
    {
        $size = (int) filesize($src);
        $handle = fopen($src, 'rb');

        try {
            $this->filesystem->writeStream($path, $handle, $this->createConfig($options));
        } finally {
            fclose($handle);
        }

        return $this->createPutResult($path, $size, $options);
    }

    public function putStream(mixed $src, string $path, array $options = []): PutResult
    {
        if ($src instanceof StreamInterface) {
            $size = (int) $src->getSize();

            $src->rewind();
            $this->filesystem->write($path, $src->getContents(), $this->createConfig($options));
        } else {
            $size = (int) (fstat($src)['size'] ?? 0);

            $this->filesystem->writeStream($path, $src, $this->createConfig($options));
        }

        return $this->createPutResult($path, $size, $options);
    }

    public function delete(string $path, array $options = []): Result
    {
        $this->filesystem->delete($path);

        return new Result(fn() => new Response());
    }

    public function getUri(string $path, array $options = []): UriInterface
    {
        try {
            return new Uri($this->filesystem->publicUrl($path, $options));
        } catch (UnableToGeneratePublicUrl) {
            return new Uri('/' . ltrim($path, '/'));
        }
    }

    public function get(string $path, array $options = []): GetResult
    {
        return new GetResult(
            responseCallback: fn() => new Response($this->readStreamOf($path)),
            path: $path,
            uri: $this->getUri($path, $options),
            fileSize: $this->filesystem->fileSize($path),
            lastModified: $this->filesystem->lastModified($path),
        );
    }

    public function read(string $path, array $options = []): string
    {
        return $this->filesystem->read($path);
    }

    public function readStream(string $path, array $options = []): StreamInterface
    {
        return $this->readStreamOf($path);
    }

    public function listContents(string $path, bool $recursive = false): iterable
    {
        $listing = $this->filesystem->listContents($path, $recursive)
            ->filter(static fn(StorageAttributes $attributes) => $attributes->isFile());

        foreach ($listing as $k => $attributes) {
            /** @var FileAttributes $attributes */
            yield $k => new GetResult(
                responseCallback: fn() => new Response($this->readStreamOf($attributes->path())),
                path: $attributes->path(),
                uri: $this->getUri($attributes->path()),
                fileSize: (int) $attributes->fileSize(),
                lastModified: $attributes->lastModified(),
                rawResult: $attributes,
            );
        }
    }

    public function exists(string $path): bool
    {
        return $this->filesystem->fileExists($path);
    }

    /**
     * @return  Filesystem
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

    private function readStreamOf(string $path): StreamInterface
    {
        return new Stream($this->filesystem->readStream($path));
    }

    private function createPutResult(string $path, int $size, array $options): PutResult
    {
        return new PutResult(
            uri: $this->getUri($path, $options),
            responseCallback: fn() => new Response($this->readStreamOf($path)),
            path: $path,
            fileSize: $size,
        );
    }

    private function createConfig(array $options): array
    {
        if (isset($options['mime_type'])) {
            $options['mimetype'] = $options['mime_type'];
            unset($options['mime_type']);
        }

        return $options;
    }
}

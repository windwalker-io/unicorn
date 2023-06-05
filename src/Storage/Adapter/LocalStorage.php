<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Storage\Adapter;

use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Unicorn\Storage\GetResult;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\Result;
use Unicorn\Storage\StorageInterface;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Application\PathResolver;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Filesystem\FileObject;
use Windwalker\Filesystem\Filesystem;
use Windwalker\Filesystem\Path;
use Windwalker\Http\Response\Response;
use Windwalker\Uri\Uri;
use Windwalker\Utilities\Str;

/**
 * The LocalStorage class.
 */
class LocalStorage implements StorageInterface
{
    /**
     * LocalStorage constructor.
     */
    public function __construct(
        protected ApplicationInterface $app,
        protected array $options = []
    ) {
        //
    }

    public function getBasePath(): string
    {
        $path = $this->options['path'] ?? '';

        if (!str_starts_with($path, DIRECTORY_SEPARATOR)) {
            $path = '@root/' . $path;
        }

        return $this->app->path($path);
    }

    public function getPath(string $suffix = ''): string
    {
        return Path::normalize($this->getBasePath() . '/' . $suffix);
    }

    public function put(string $data, string $path, array $options = []): PutResult
    {
        $file = Filesystem::write(
            $this->getPath($path),
            $data
        );

        return new PutResult(
            $this->getUri($path),
            fn () => new Response($file->getStream()),
            $file
        );
    }

    public function putFile(string $src, string $path, array $options = []): PutResult
    {
        $file = Filesystem::write(
            $this->getPath($path),
            file_get_contents($src)
        );

        return new PutResult(
            $this->getUri($path),
            fn () => new Response($file->getStream()),
            $file
        );
    }

    public function putStream(mixed $src, string $path, array $options = []): PutResult
    {
        $file = Filesystem::writeStream(
            $this->getPath($path),
            $src
        );

        return new PutResult(
            $this->getUri($path),
            fn () => new Response($file->getStream()),
            $file
        );
    }

    public function delete(string $path, array $options = []): Result
    {
        $path = $this->stripBasePath($path);

        $path = $this->getPath($path);

        $file = Filesystem::delete($path);

        return new Result(fn () => new Response(), $file);
    }

    public function getUri(string $path, array $options = []): UriInterface
    {
        $handler = $this->options['uri_handler'] ?? null;
        $path = ltrim($path, '/');

        if (is_callable($handler)) {
            return $handler($path);
        }

        $su = $this->app->service(SystemUri::class);

        $root = $options['cdn']['root']
            ?? $this->options['host']
            ?? $su->root;

        $base = $this->options['uri_base'] ?? '';

        if ($base) {
            $path = $base . '/' . $path;
        }

        $url = $su->addUriBase($path, $root);

        return new Uri(Str::removeLeft($url, $su->root));
    }

    public function get(string $path, array $options = []): GetResult
    {
        $file = Filesystem::get($this->getPath($path));

        return (new GetResult(
            fn () => new Response($file->getStream()),
            $file
        ))
            ->setUri($this->getUri($path))
            ->setPath($path)
            ->setLastModified($file->getMTime())
            ->setFileSize($file->getSize());
    }

    public function read(string $path, array $options = []): string
    {
        return (string) Filesystem::read($this->getPath($path));
    }

    public function readStream(string $path, array $options = []): StreamInterface
    {
        return Filesystem::readStream($this->getPath($path));
    }

    public function listContents(string $path, bool $recursive = false): iterable
    {
        foreach (Filesystem::files($this->getPath($path), $recursive) as $k => $file) {
            yield $k => (new GetResult(
                fn () => new Response($file->getStream()),
                $file
            ))
                ->setUri($this->getUri($path))
                ->setPath($path)
                ->setLastModified($file->getMTime())
                ->setFileSize($file->getSize());
        }
    }

    public function exists(string $path): bool
    {
        return is_file($this->getPath($path));
    }

    public function stripBasePath(string $url): string
    {
        if (str_starts_with($url, $this->getPath())) {
            return ltrim(Str::removeLeft($url, $this->getPath()), '\\/');
        }

        if (str_starts_with($url, $this->getBasePath())) {
            return ltrim(Str::removeLeft($url, $this->getBasePath()), '\\/');
        }

        $su = $this->app->service(SystemUri::class);
        $base = $su->path . $this->options['uri_base'] . '/';

        if (str_starts_with($url, $base)) {
            return Str::removeLeft($url, $base);
        }

        $base = $su->root . $this->options['uri_base'] . '/';

        if (str_starts_with($url, $base)) {
            return Str::removeLeft($url, $base);
        }

        return $url;
    }
}

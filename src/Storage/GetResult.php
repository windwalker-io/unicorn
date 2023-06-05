<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Storage;

use Psr\Http\Message\UriInterface;

/**
 * The GetResult class.
 */
class GetResult extends Result
{
    protected \DateTimeInterface $lastModified;

    protected int $fileSize = 0;

    protected string $path = '';

    protected UriInterface $uri;

    /**
     * @return \DateTimeInterface
     */
    public function getLastModified(): \DateTimeInterface
    {
        return $this->lastModified;
    }

    /**
     * @param  \DateTimeInterface|mixed  $lastModified
     *
     * @return  static  Return self to support chaining.
     * @throws \Exception
     */
    public function setLastModified(mixed $lastModified): static
    {
        if (!$lastModified instanceof \DateTimeInterface) {
            $lastModified = new \DateTimeImmutable($lastModified);
        }

        $this->lastModified = $lastModified;

        return $this;
    }

    /**
     * @return int
     */
    public function getFileSize(): int
    {
        return $this->fileSize;
    }

    /**
     * @param  int  $fileSize
     *
     * @return  static  Return self to support chaining.
     */
    public function setFileSize(int $fileSize): static
    {
        $this->fileSize = $fileSize;

        return $this;
    }

    /**
     * @param  string  $path
     *
     * @return  static  Return self to support chaining.
     */
    public function setPath(string $path): static
    {
        $this->path = $path;

        return $this;
    }

    /**
     * @return string
     */
    public function getPath(): string
    {
        return $this->path;
    }

    /**
     * @return UriInterface
     */
    public function getUri(): UriInterface
    {
        return $this->uri;
    }

    /**
     * @param  UriInterface  $uri
     *
     * @return  static  Return self to support chaining.
     */
    public function setUri(UriInterface $uri): static
    {
        $this->uri = $uri;

        return $this;
    }
}

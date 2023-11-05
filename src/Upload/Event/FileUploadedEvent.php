<?php

declare(strict_types=1);

namespace Unicorn\Upload\Event;

use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UploadedFileInterface;
use Unicorn\Storage\PutResult;
use Windwalker\Event\AbstractEvent;

/**
 * The FileUploadedEvent class.
 */
class FileUploadedEvent extends AbstractEvent
{
    protected mixed $file;

    protected PutResult $result;

    protected StreamInterface $stream;

    protected string $dest = '';

    protected array $options = [];

    /**
     * @return UploadedFileInterface|string
     */
    public function getFile(): mixed
    {
        return $this->file;
    }

    /**
     * @param  UploadedFileInterface|string  $file
     *
     * @return  static  Return self to support chaining.
     */
    public function setFile(mixed $file): static
    {
        $this->file = $file;

        return $this;
    }

    /**
     * @return PutResult
     */
    public function getResult(): PutResult
    {
        return $this->result;
    }

    /**
     * @param  PutResult  $result
     *
     * @return  static  Return self to support chaining.
     */
    public function setResult(PutResult $result): static
    {
        $this->result = $result;

        return $this;
    }

    /**
     * @return StreamInterface
     */
    public function getStream(): StreamInterface
    {
        return $this->stream;
    }

    /**
     * @param  StreamInterface  $stream
     *
     * @return  static  Return self to support chaining.
     */
    public function setStream(StreamInterface $stream): static
    {
        $this->stream = $stream;

        return $this;
    }

    /**
     * @return string
     */
    public function getDest(): string
    {
        return $this->dest;
    }

    /**
     * @param  string  $dest
     *
     * @return  static  Return self to support chaining.
     */
    public function setDest(string $dest): static
    {
        $this->dest = $dest;

        return $this;
    }

    /**
     * @return array
     */
    public function getOptions(): array
    {
        return $this->options;
    }

    /**
     * @param  array  $options
     *
     * @return  static  Return self to support chaining.
     */
    public function setOptions(array $options): static
    {
        $this->options = $options;

        return $this;
    }
}

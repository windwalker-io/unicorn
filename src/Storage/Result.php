<?php

declare(strict_types=1);

namespace Unicorn\Storage;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Windwalker\Utilities\Accessible\AccessorBCTrait;

/**
 * The Result class.
 */
class Result
{
    use AccessorBCTrait;

    public ?ResponseInterface $response = null {
        get => $this->response ??= ($this->responseCallback)($this);
    }

    public StreamInterface $body {
        get => $this->response->getBody();
    }

    /**
     * PutResult constructor.
     */
    public function __construct(
        public \Closure $responseCallback,
        public mixed $rawResult = null
    ) {
    }

    /**
     * @return  StreamInterface
     *
     * @deprecated  Use props instead.
     */
    public function getBody(): StreamInterface
    {
        return $this->body;
    }
}

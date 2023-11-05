<?php

declare(strict_types=1);

namespace Unicorn\Storage;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;

/**
 * The Result class.
 */
class Result
{
    protected ?ResponseInterface $response = null;

    /**
     * PutResult constructor.
     */
    public function __construct(
        protected \Closure $responseCallback,
        protected mixed $rawResult = null
    ) {
    }

    /**
     * @return ResponseInterface
     */
    public function getResponse(): ResponseInterface
    {
        return $this->response ??= ($this->responseCallback)($this);
    }

    /**
     * @return mixed|null
     */
    public function getRawResult(): mixed
    {
        return $this->rawResult;
    }

    public function getBody(): StreamInterface
    {
        return $this->getResponse()->getBody();
    }
}

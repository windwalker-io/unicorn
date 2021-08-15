<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Storage;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;

/**
 * The PutResult class.
 */
class PutResult extends Result implements \Stringable
{
    /**
     * PutResult constructor.
     */
    public function __construct(
        protected UriInterface $uri,
        protected \Closure $responseCallback,
        protected mixed $rawResult = null
    ) {
    }

    /**
     * @return UriInterface
     */
    public function getUri(): UriInterface
    {
        return $this->uri;
    }

    public function __toString()
    {
        return (string) $this->getUri();
    }
}

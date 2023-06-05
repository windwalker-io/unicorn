<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Storage;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;

use Windwalker\Uri\UriHelper;

use function Windwalker\uid;

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
     * @param  string|bool  $suffix
     *
     * @return UriInterface
     * @throws \Exception
     */
    public function getUri(string|bool $suffix = false): UriInterface
    {
        $uri = $this->uri;

        if ($suffix) {
            if ($suffix === true) {
                $suffix = uid();
            }

            $query = $uri->getQuery();

            if ($query) {
                $query .= '&';
            }

            $query .= $suffix;

            $uri = $uri->withQuery($query);
        }

        return $uri;
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

    public function __toString()
    {
        return (string) $this->getUri();
    }
}

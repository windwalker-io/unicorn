<?php

declare(strict_types=1);

namespace Unicorn\Storage;

use Psr\Http\Message\UriInterface;

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

    public function getUriString(string|bool $suffix = false): string
    {
        return (string) $this->getUri($suffix);
    }

    public function __toString(): string
    {
        return (string) $this->getUri();
    }
}

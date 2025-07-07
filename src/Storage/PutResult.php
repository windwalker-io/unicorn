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
        public UriInterface $uri,
        public ?string $path = null,
        \Closure $responseCallback,
        mixed $rawResult = null,
        public int $fileSize = 0,
    ) {
        parent::__construct($responseCallback, $rawResult);
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

    public function getUriString(string|bool $suffix = false): string
    {
        return (string) $this->getUri($suffix);
    }

    public function __toString(): string
    {
        return (string) $this->getUri();
    }
}

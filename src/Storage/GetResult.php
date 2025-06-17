<?php

declare(strict_types=1);

namespace Unicorn\Storage;

use Psr\Http\Message\UriInterface;

/**
 * The GetResult class.
 */
// phpcs:disable
class GetResult extends Result
{
    public function __construct(
        \Closure $responseCallback,
        public string $path,
        public UriInterface $uri,
        public int $fileSize = 0,
        public ?\DateTimeInterface $lastModified = null {
            set(mixed $value) {
                if ($value === false) {
                    $value = null;
                }

                if (is_int($value)) {
                    $value = \DateTimeImmutable::createFromTimestamp($value);
                }

                if (is_string($value)) {
                    $value = new \DateTimeImmutable($value);
                }

                $this->lastModified = $value;
            }
        },
        mixed $rawResult = null,
    ) {
        parent::__construct($responseCallback, $rawResult);
    }
}

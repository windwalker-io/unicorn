<?php

declare(strict_types=1);

namespace Unicorn\Storage;

use Psr\Http\Message\UriInterface;

/**
 * The GetResult class.
 */
class GetResult extends Result
{
    public int $fileSize = 0;
    
    public \DateTimeInterface $lastModified {
        set(\DateTimeInterface $value) {
            if (!$value instanceof \DateTimeInterface) {
                $value = new \DateTimeImmutable($value);
            }

            $this->lastModified = $value;
        }
    }

    public string $path = '';

    public UriInterface $uri;
}

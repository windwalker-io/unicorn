<?php

declare(strict_types=1);

namespace Unicorn\Tests\Support\Intervention;

use Psr\Http\Message\StreamInterface;

/**
 * Stand-in for the Intervention v2 Image class, so v2 call sequences can be mocked
 * without installing Intervention v2.
 */
class V2Image
{
    public function orientate(): self
    {
        return $this;
    }

    public function getCore(): V2Core
    {
        return new V2Core();
    }

    public function width(): int
    {
        return 0;
    }

    public function height(): int
    {
        return 0;
    }

    public function fit(?int $width = null, ?int $height = null, ?callable $callback = null): self
    {
        return $this;
    }

    public function resize(?int $width = null, ?int $height = null, ?callable $callback = null): self
    {
        return $this;
    }

    public function stream(?string $format = null, ?int $quality = null): StreamInterface
    {
        throw new \LogicException('Stub method, must be mocked.');
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Tests\Support\Intervention;

/**
 * Stand-in for the Intervention v2 ImageManager, which is not installed alongside v3.
 */
class V2ImageManager
{
    public function __construct(array $config = []) {}

    public function make(mixed $image): V2Image
    {
        throw new \LogicException('Stub method, must be mocked.');
    }
}

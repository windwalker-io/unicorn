<?php

declare(strict_types=1);

namespace Unicorn\Tests\Support\Intervention;

/**
 * Stand-in for the Imagick core object returned by Intervention v2 Image::getCore().
 */
class V2Core
{
    public function stripImage(): self
    {
        return $this;
    }
}

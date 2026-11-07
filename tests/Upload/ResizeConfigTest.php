<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Unicorn\Upload\FileUploadService;
use Unicorn\Upload\ResizeConfig;

/**
 * Tests for ResizeConfig defaults.
 */
class ResizeConfigTest extends TestCase
{
    #[Test]
    #[TestDox('Default resize config is enabled, uses GD and keeps aspect ratio')]
    public function defaults(): void
    {
        $config = new ResizeConfig();

        self::assertTrue($config->enabled);
        self::assertSame(FileUploadService::DRIVER_GD, $config->driver);
        self::assertFalse($config->stripExif);
        self::assertNull($config->width);
        self::assertNull($config->height);
        self::assertSame(85, $config->quality);
        self::assertFalse($config->crop);
        self::assertNull($config->outputFormat);
        self::assertTrue($config->orientate);
        self::assertFalse($config->interlaced);
    }
}

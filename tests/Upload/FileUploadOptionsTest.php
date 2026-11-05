<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Unicorn\Upload\FileUploadOptions;
use Unicorn\Upload\FileUploadService;
use Unicorn\Upload\ResizeConfig;

/**
 * Tests for FileUploadOptions defaults and normalization.
 */
class FileUploadOptionsTest extends TestCase
{
    #[Test]
    #[TestDox('Default options use local storage with redraw and optimize disabled')]
    public function defaults(): void
    {
        $options = new FileUploadOptions();

        self::assertSame('local', $options->storage);
        self::assertNull($options->dir);
        self::assertFalse($options->forceRedraw);
        self::assertFalse($options->rawGif);
        self::assertFalse($options->optimize);
        self::assertSame([], $options->storageOptions);
    }

    #[Test]
    #[TestDox('Array resize config is wrapped into a ResizeConfig')]
    public function resizeArrayIsWrapped(): void
    {
        $options = new FileUploadOptions(resize: ['width' => 200, 'driver' => FileUploadService::DRIVER_IMAGICK]);

        self::assertInstanceOf(ResizeConfig::class, $options->resize);
        self::assertSame(200, $options->resize->width);
        self::assertSame(FileUploadService::DRIVER_IMAGICK, $options->resize->driver);
    }

    #[Test]
    #[TestDox('Constructor merges options and storageOptions, with storageOptions taking precedence')]
    public function storageOptionsMerge(): void
    {
        $options = new FileUploadOptions(
            storageOptions: ['acl' => 'private', 'cache' => 60],
            options: ['acl' => 'public', 'region' => 'eu'],
        );

        self::assertSame(
            ['acl' => 'private', 'region' => 'eu', 'cache' => 60],
            $options->storageOptions
        );
    }

    #[Test]
    #[TestDox('Setting options later appends to storageOptions')]
    public function optionsSetterAppendsStorageOptions(): void
    {
        $options = new FileUploadOptions(storageOptions: ['a' => 1]);

        $options->options = ['b' => 2];

        self::assertSame(['a' => 1, 'b' => 2], $options->storageOptions);
    }

    #[Test]
    #[TestDox('Resize property is lazily created when set to null')]
    public function resizeLazyDefault(): void
    {
        $options = new FileUploadOptions();
        $options->resize = null;

        self::assertInstanceOf(ResizeConfig::class, $options->resize);
        self::assertTrue($options->resize->enabled);
    }
}

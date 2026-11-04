<?php

declare(strict_types=1);

namespace Unicorn\Tests\Flysystem;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Flysystem\Base64DataUri;

/**
 * The Base64DataUriTest class.
 */
class Base64DataUriTest extends TestCase
{
    protected string $tmpDir;

    protected function setUp(): void
    {
        $this->tmpDir = sys_get_temp_dir() . '/unicorn-base64-' . uniqid();
        mkdir($this->tmpDir, 0777, true);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->tmpDir . '/*') ?: [] as $file) {
            @unlink($file);
        }

        @rmdir($this->tmpDir);
    }

    #[Test]
    public function isDataUri(): void
    {
        $this->assertTrue(Base64DataUri::isDataUri('data:text/plain;base64,SGVsbG8='));
        $this->assertFalse(Base64DataUri::isDataUri('https://example.com/a.png'));
        $this->assertFalse(Base64DataUri::isDataUri(''));
    }

    #[Test]
    public function encodeAndDecodeText(): void
    {
        $uri = Base64DataUri::encode('Hello World', 'text/plain');

        $this->assertSame('data:text/plain;base64,' . base64_encode('Hello World'), $uri);

        $data = Base64DataUri::decode($uri, $mime);

        $this->assertSame('text/plain', $mime);
        $this->assertSame('Hello World', $data);
    }

    #[Test]
    public function encodeAndDecodeBinaryRoundTrip(): void
    {
        $binary = random_bytes(256);

        $uri = Base64DataUri::encode($binary, 'application/octet-stream');

        $data = Base64DataUri::decode($uri, $mime);

        $this->assertSame('application/octet-stream', $mime);
        $this->assertSame($binary, $data);
    }

    #[Test]
    public function toStream(): void
    {
        $uri = Base64DataUri::encode('Stream Content', 'text/plain');

        $stream = Base64DataUri::toStream($uri, $mime);

        $this->assertSame('text/plain', $mime);
        $this->assertSame(0, $stream->tell());
        $this->assertSame('Stream Content', (string) $stream);
    }

    #[Test]
    public function toFile(): void
    {
        $path = $this->tmpDir . '/out.txt';

        $file = Base64DataUri::toFile(
            'data:text/plain;base64,' . base64_encode('File Content'),
            $path
        );

        $this->assertFileExists($path);
        $this->assertSame('File Content', file_get_contents($path));
        $this->assertNotNull($file);
    }

    #[Test]
    public function fromFileWithExtensionMimeType(): void
    {
        $path = $this->tmpDir . '/sample.txt';
        file_put_contents($path, 'Sample');

        $uri = Base64DataUri::fromFile($path);

        $this->assertStringStartsWith('data:text/plain;base64,', $uri);
        $this->assertSame('Sample', Base64DataUri::decode($uri));
    }

    #[Test]
    public function fromFileWithExplicitMimeType(): void
    {
        $path = $this->tmpDir . '/sample.bin';
        file_put_contents($path, 'Explicit');

        $uri = Base64DataUri::fromFile($path, 'image/png');

        $this->assertStringStartsWith('data:image/png;base64,', $uri);
        $this->assertSame('Explicit', Base64DataUri::decode($uri));
    }

    #[Test]
    public function fromFileThrowsWhenFileNotFound(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('File not found.');

        Base64DataUri::fromFile($this->tmpDir . '/missing.txt');
    }

    #[Test]
    public function getMimeType(): void
    {
        $this->assertSame('image/png', Base64DataUri::getMimeType('data:image/png;base64,AAAA'));
        $this->assertNull(Base64DataUri::getMimeType('https://example.com/a.png'));
    }
}

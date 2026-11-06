<?php

declare(strict_types=1);

namespace Unicorn\Tests\Storage\Adapter;

use GuzzleHttp\Psr7\Utils;
use League\Flysystem\Filesystem;
use League\Flysystem\Local\LocalFilesystemAdapter;
use League\Flysystem\UrlGeneration\PublicUrlGenerator;
use org\bovigo\vfs\vfsStream;
use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Storage\Adapter\FlysystemStorage;

/**
 * Covers FlysystemStorage against a real Flysystem local adapter on a vfsStream virtual filesystem. The adapter
 * disables file locking (`LOCK_EX`), which vfsStream does not support. The public URL behavior uses a local adapter
 * subclass that implements PublicUrlGenerator, so no cloud service is needed.
 */
final class FlysystemStorageTest extends TestCase
{
    private string $root;

    #[Before]
    public function createRootDirectory(): void
    {
        $this->root = vfsStream::setup('root')->url();
    }

    #[Test]
    public function putWritesDataAndReturnsResult(): void
    {
        $storage = $this->createStorage();

        $result = $storage->put('hello', 'a/b.txt');

        self::assertSame('a/b.txt', $result->path);
        self::assertSame(5, $result->fileSize);
        self::assertSame('hello', file_get_contents($this->root . '/a/b.txt'));
    }

    #[Test]
    public function putAcceptsMimeTypeOptionWithoutPassingItThrough(): void
    {
        $storage = $this->createStorage();

        $storage->put('data', 'typed.txt', ['mime_type' => 'text/plain']);

        self::assertSame('data', file_get_contents($this->root . '/typed.txt'));
    }

    #[Test]
    public function putFileCopiesSourceFile(): void
    {
        $storage = $this->createStorage();
        $src = $this->root . '/source.txt';
        file_put_contents($src, 'copied!');

        $result = $storage->putFile($src, 'copy.txt');

        self::assertSame(7, $result->fileSize);
        self::assertSame('copied!', file_get_contents($this->root . '/copy.txt'));
    }

    #[Test]
    public function putStreamWritesResourceContent(): void
    {
        $storage = $this->createStorage();
        $handle = fopen('php://memory', 'w+');
        fwrite($handle, 'resource-data');
        rewind($handle);

        $result = $storage->putStream($handle, 'res.txt');
        fclose($handle);

        self::assertSame(13, $result->fileSize);
        self::assertSame('resource-data', file_get_contents($this->root . '/res.txt'));
    }

    #[Test]
    public function putStreamWritesPsr7StreamContent(): void
    {
        $storage = $this->createStorage();

        $result = $storage->putStream(Utils::streamFor('psr-data'), 'psr.txt');

        self::assertSame(8, $result->fileSize);
        self::assertSame('psr-data', file_get_contents($this->root . '/psr.txt'));
    }

    #[Test]
    public function readAndReadStreamReturnStoredContent(): void
    {
        $storage = $this->createStorage();
        $storage->put('content', 'r.txt');

        self::assertSame('content', $storage->read('r.txt'));
        self::assertSame('content', (string) $storage->readStream('r.txt'));
    }

    #[Test]
    public function existsReturnsTrueOnlyForExistingFiles(): void
    {
        $storage = $this->createStorage();
        $storage->put('x', 'present.txt');

        self::assertTrue($storage->exists('present.txt'));
        self::assertFalse($storage->exists('missing.txt'));
    }

    #[Test]
    public function deleteRemovesFile(): void
    {
        $storage = $this->createStorage();
        $storage->put('bye', 'gone.txt');

        $storage->delete('gone.txt');

        self::assertFalse($storage->exists('gone.txt'));
    }

    #[Test]
    public function getReturnsFileSizeModifiedTimeAndBody(): void
    {
        $storage = $this->createStorage(publicUrl: 'https://cdn.example.com/meta.txt');
        $storage->put('12345', 'meta.txt');

        $result = $storage->get('meta.txt');

        self::assertSame('meta.txt', $result->path);
        self::assertSame(5, $result->fileSize);
        self::assertInstanceOf(\DateTimeInterface::class, $result->lastModified);
        self::assertSame('https://cdn.example.com/meta.txt', (string) $result->uri);
        self::assertSame('12345', (string) $result->body);
    }

    #[Test]
    public function listContentsYieldsOnlyFiles(): void
    {
        $storage = $this->createStorage();
        $storage->put('1', 'list/one.txt');
        $storage->put('22', 'list/two.txt');
        mkdir($this->root . '/list/sub');

        $sizes = [];

        foreach ($storage->listContents('list') as $result) {
            $sizes[] = $result->fileSize;
        }

        sort($sizes);

        self::assertSame([1, 2], $sizes);
    }

    #[Test]
    public function listContentsRecursiveIncludesNestedFiles(): void
    {
        $storage = $this->createStorage();
        $storage->put('1', 'tree/a.txt');
        $storage->put('333', 'tree/deep/b.txt');

        $paths = [];

        foreach ($storage->listContents('tree', true) as $result) {
            $paths[] = $result->path;
        }

        sort($paths);

        self::assertSame(['tree/a.txt', 'tree/deep/b.txt'], $paths);
    }

    #[Test]
    public function getUriUsesPublicUrlGenerator(): void
    {
        $storage = $this->createStorage(publicUrl: 'https://cdn.example.com/dir/file.jpg');

        self::assertSame(
            'https://cdn.example.com/dir/file.jpg',
            (string) $storage->getUri('dir/file.jpg')
        );
    }

    #[Test]
    public function getUriFallsBackToPathWhenAdapterHasNoPublicUrlGenerator(): void
    {
        $storage = $this->createStorage();

        self::assertSame('/file.jpg', (string) $storage->getUri('file.jpg'));
    }

    #[Test]
    public function putReturnsFallbackUriWhenAdapterHasNoPublicUrlGenerator(): void
    {
        $storage = $this->createStorage();

        $result = $storage->put('x', 'docs/a.txt');

        self::assertSame('/docs/a.txt', (string) $result->uri);
    }

    #[Test]
    public function getAndSetFilesystemReplaceTheUnderlyingFilesystem(): void
    {
        $storage = $this->createStorage();
        $other = $this->createFilesystem();

        self::assertNotSame($other, $storage->getFilesystem());

        $result = $storage->setFilesystem($other);

        self::assertSame($storage, $result);
        self::assertSame($other, $storage->getFilesystem());
    }

    private function createStorage(?string $publicUrl = null): FlysystemStorage
    {
        return new FlysystemStorage($this->createFilesystem($publicUrl));
    }

    private function createFilesystem(?string $publicUrl = null): Filesystem
    {
        $root = $this->root;

        if ($publicUrl === null) {
            return new Filesystem(new LocalFilesystemAdapter($root, null, 0));
        }

        $adapter = new class ($root, $publicUrl) extends LocalFilesystemAdapter implements PublicUrlGenerator {
            public function __construct(string $root, private readonly string $fixedUrl)
            {
                parent::__construct($root, null, 0);
            }

            public function publicUrl(string $path, \League\Flysystem\Config $config): string
            {
                return $this->fixedUrl;
            }
        };

        return new Filesystem($adapter);
    }
}

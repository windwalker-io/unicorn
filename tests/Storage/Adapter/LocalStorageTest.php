<?php

declare(strict_types=1);

namespace Unicorn\Tests\Storage\Adapter;

use GuzzleHttp\Psr7\Uri;
use PHPUnit\Framework\Attributes\After;
use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Filesystem\Filesystem;
use Unicorn\Storage\Adapter\LocalStorage;

/**
 * Covers LocalStorage against a temporary directory. The application is stubbed to resolve `@root` to that
 * directory, and URIs come from the `uri_handler` option, so no booted host app is required.
 */
final class LocalStorageTest extends TestCase
{
    private string $root;

    #[Before]
    public function createRootDirectory(): void
    {
        $this->root = sys_get_temp_dir() . '/local-storage-test-' . uniqid('', true);
        mkdir($this->root, 0777, true);
    }

    #[After]
    public function removeRootDirectory(): void
    {
        Filesystem::delete($this->root);
    }

    #[Test]
    public function putWritesDataUnderBasePathAndReturnsResult(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);

        $result = $storage->put('hello', 'a/b.txt');

        self::assertSame('a/b.txt', $result->path);
        self::assertSame(5, $result->fileSize);
        self::assertSame('hello', file_get_contents($this->root . '/uploads/a/b.txt'));
        self::assertSame('/files/a/b.txt', (string) $result->uri);
    }

    #[Test]
    public function putFileCopiesSourceFileContent(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);
        $src = $this->root . '/source.txt';
        file_put_contents($src, 'copied');

        $result = $storage->putFile($src, 'copy.txt');

        self::assertSame('copied', file_get_contents($this->root . '/uploads/copy.txt'));
        self::assertSame(6, $result->fileSize);
    }

    #[Test]
    public function putStreamWritesResourceContent(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);
        $handle = fopen('php://memory', 'w+');
        fwrite($handle, 'stream-data');
        rewind($handle);

        $result = $storage->putStream($handle, 'stream.txt');
        fclose($handle);

        self::assertSame('stream-data', file_get_contents($this->root . '/uploads/stream.txt'));
        self::assertSame('stream.txt', $result->path);
    }

    #[Test]
    public function readReturnsStoredContent(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);
        $storage->put('content', 'r.txt');

        self::assertSame('content', $storage->read('r.txt'));
        self::assertSame('content', (string) $storage->readStream('r.txt'));
    }

    #[Test]
    public function existsReturnsTrueOnlyForFiles(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);
        $storage->put('x', 'present.txt');

        self::assertTrue($storage->exists('present.txt'));
        self::assertFalse($storage->exists('missing.txt'));
    }

    #[Test]
    public function deleteRemovesFileWhenGivenFullPath(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);
        $storage->put('bye', 'gone.txt');

        $storage->delete($storage->getPath('gone.txt'));

        self::assertFalse($storage->exists('gone.txt'));
    }

    #[Test]
    public function getReturnsFileMetadata(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);
        $storage->put('12345', 'meta.txt');

        $result = $storage->get('meta.txt');

        self::assertSame('meta.txt', $result->path);
        self::assertSame(5, $result->fileSize);
        self::assertInstanceOf(\DateTimeInterface::class, $result->lastModified);
        self::assertSame('/files/meta.txt', (string) $result->uri);
    }

    #[Test]
    public function listContentsYieldsFilesInDirectory(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);
        $storage->put('1', 'list/one.txt');
        $storage->put('22', 'list/two.txt');

        $names = [];

        foreach ($storage->listContents('list') as $result) {
            $names[] = $result->fileSize;
        }

        sort($names);

        self::assertSame([1, 2], $names);
    }

    #[Test]
    public function getBasePathUsesAbsolutePathsAsIs(): void
    {
        $storage = $this->createStorage(['path' => '/var/data']);

        self::assertSame('/var/data', $storage->getBasePath());
    }

    #[Test]
    public function getPathNormalizesSuffixUnderBasePath(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);

        self::assertSame($this->root . '/uploads/x/y.txt', $storage->getPath('x/y.txt'));
    }

    #[Test]
    public function getUriUsesUriHandlerWhenProvided(): void
    {
        $storage = $this->createStorage([
            'path' => 'uploads',
            'uri_handler' => static fn(string $path) => new Uri('https://cdn.example.com/' . $path),
        ]);

        self::assertSame('https://cdn.example.com/dir/file.jpg', (string) $storage->getUri('/dir/file.jpg'));
    }

    #[Test]
    public function stripBasePathRemovesStoragePrefix(): void
    {
        $storage = $this->createStorage(['path' => 'uploads']);

        self::assertSame('a/b.txt', $storage->stripBasePath($storage->getPath('a/b.txt')));
        self::assertSame('a/b.txt', $storage->stripBasePath($storage->getBasePath() . '/a/b.txt'));
    }

    /**
     * @param  array  $options
     *
     * @return  LocalStorage
     */
    private function createStorage(array $options): LocalStorage
    {
        $app = $this->createStub(ApplicationInterface::class);
        $app->method('path')
            ->willReturnCallback(fn(string $path) => str_replace('@root', $this->root, $path));

        $options['uri_handler'] ??= static fn(string $path) => new Uri('/files/' . $path);

        return new LocalStorage($app, $options);
    }
}

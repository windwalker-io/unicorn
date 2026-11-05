<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use GuzzleHttp\Psr7\Uri;
use GuzzleHttp\Psr7\Utils;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\StreamInterface;
use Symfony\Component\Mime\MimeTypes;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\StorageInterface;
use Unicorn\Upload\Event\FileUploadedEvent;
use Unicorn\Upload\FileUploadOptions;
use Unicorn\Upload\FileUploadService;
use Windwalker\DI\Container;

/**
 * Tests for the storage and event flow of FileUploadService::putToStorage().
 */
class FileUploadServicePutToStorageTest extends TestCase
{
    private const string PNG_1X1 = 'data:image/png;base64,'
        . 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    private function createPutResult(string $path = 'uploads/a.png'): PutResult
    {
        return new PutResult(
            uri: new Uri('https://example.com/' . $path),
            responseCallback: static fn() => null,
            path: $path,
        );
    }

    /**
     * Build a service whose storage is the given mock, bypassing the container lookup.
     */
    private function createService(StorageInterface $storage, array $options = []): FileUploadService
    {
        return new class (new Container(), $options, MimeTypes::getDefault(), $storage) extends FileUploadService {
            public function __construct(
                Container $container,
                FileUploadOptions|array $options,
                ?\Symfony\Component\Mime\MimeTypesInterface $mimeTypes,
                private readonly StorageInterface $fakeStorage,
            ) {
                parent::__construct($container, $options, $mimeTypes);
            }

            public function getStorage(): StorageInterface
            {
                return $this->fakeStorage;
            }
        };
    }

    private function callPutToStorage(
        FileUploadService $service,
        StreamInterface $stream,
        mixed $file,
        string $dest,
        FileUploadOptions $options,
    ): PutResult {
        $method = new \ReflectionMethod($service, 'putToStorage');

        return $method->invoke($service, $stream, $file, $dest, $options);
    }

    #[Test]
    #[TestDox('putToStorage() writes the stream to storage with the destination path')]
    public function writesStreamToStorage(): void
    {
        $stream = Utils::streamFor('hello');
        $result = $this->createPutResult();

        $storage = $this->createMock(StorageInterface::class);
        $storage->expects(self::once())
            ->method('putStream')
            ->with($stream, 'uploads/a.png')
            ->willReturn($result);

        $service = $this->createService($storage);

        $returned = $this->callPutToStorage($service, $stream, 'a.png', 'uploads/a.png', new FileUploadOptions());

        self::assertSame($result, $returned);
    }

    #[Test]
    #[TestDox('putToStorage() merges service and file storage options, file options win')]
    public function mergesStorageOptions(): void
    {
        $stream = Utils::streamFor('hello');

        $storage = $this->createMock(StorageInterface::class);
        $storage->expects(self::once())
            ->method('putStream')
            ->with(
                $stream,
                'uploads/a.png',
                ['acl' => 'public', 'cache' => 60, 'region' => 'eu']
            )
            ->willReturn($this->createPutResult());

        $service = $this->createService($storage);
        $service->options->storageOptions = ['acl' => 'private', 'cache' => 60];

        $fileOptions = new FileUploadOptions(storageOptions: ['acl' => 'public', 'region' => 'eu']);

        $this->callPutToStorage($service, $stream, 'a.png', 'uploads/a.png', $fileOptions);
    }

    #[Test]
    #[TestDox('putToStorage() emits FileUploadedEvent with file, result, stream, options and dest')]
    public function emitsFileUploadedEvent(): void
    {
        $stream = Utils::streamFor('hello');
        $result = $this->createPutResult();
        $options = new FileUploadOptions();

        $storage = $this->createStub(StorageInterface::class);
        $storage->method('putStream')->willReturn($result);

        $service = $this->createService($storage);

        $received = [];
        $service->getEventDispatcher()->on(
            FileUploadedEvent::class,
            static function (FileUploadedEvent $event) use (&$received): void {
                $received[] = $event;
            }
        );

        $this->callPutToStorage($service, $stream, 'upload.png', 'uploads/a.png', $options);

        self::assertCount(1, $received);
        self::assertSame('upload.png', $received[0]->file);
        self::assertSame($result, $received[0]->result);
        self::assertSame($stream, $received[0]->stream);
        self::assertSame($options, $received[0]->options);
        self::assertSame('uploads/a.png', $received[0]->dest);
    }

    #[Test]
    #[TestDox('putToStorage() returns the result replaced by an event listener')]
    public function returnsResultReplacedByListener(): void
    {
        $original = $this->createPutResult('uploads/original.png');
        $replaced = $this->createPutResult('uploads/replaced.png');

        $storage = $this->createStub(StorageInterface::class);
        $storage->method('putStream')->willReturn($original);

        $service = $this->createService($storage);
        $service->getEventDispatcher()->on(
            FileUploadedEvent::class,
            static function (FileUploadedEvent $event) use ($replaced): void {
                $event->result = $replaced;
            }
        );

        $returned = $this->callPutToStorage(
            $service,
            Utils::streamFor('hello'),
            'a.png',
            'uploads/original.png',
            new FileUploadOptions()
        );

        self::assertSame($replaced, $returned);
    }

    #[Test]
    #[TestDox('handleBase64() decodes an image data URI and stores it through putToStorage()')]
    public function handleBase64StoresImage(): void
    {
        $storage = $this->createMock(StorageInterface::class);
        $storage->expects(self::once())
            ->method('putStream')
            ->with(
                self::isInstanceOf(StreamInterface::class),
                'pixel.png'
            )
            ->willReturnCallback(function (StreamInterface $stream): PutResult {
                self::assertGreaterThan(0, $stream->getSize());
                $stream->rewind();
                self::assertSame("\x89PNG", substr($stream->getContents(), 0, 4));

                return $this->createPutResult('pixel.png');
            });

        $service = $this->createService($storage);

        $result = $service->handleBase64(self::PNG_1X1, 'pixel.png');

        self::assertSame('pixel.png', $result->path);
    }
}

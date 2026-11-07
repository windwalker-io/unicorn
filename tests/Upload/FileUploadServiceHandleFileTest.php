<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use GuzzleHttp\Psr7\Uri;
use GuzzleHttp\Psr7\UploadedFile;
use GuzzleHttp\Psr7\Utils;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\ImageManager;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\StreamInterface;
use Symfony\Component\Mime\MimeTypes;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\StorageInterface;
use Unicorn\Upload\Exception\FileUploadException;
use Unicorn\Upload\FileUploadOptions;
use Unicorn\Upload\FileUploadService;
use Unicorn\Upload\ImageRedrawProcessor;
use Windwalker\DI\Container;

/**
 * Tests for FileUploadService::handleFile(), handleFileData() and the mime/type helpers.
 */
class FileUploadServiceHandleFileTest extends TestCase
{
    private string $dir;

    private string $pngPath;

    private string $txtPath;

    /**
     * @var  array<int, array{stream: mixed, path: string}>
     */
    private array $puts = [];

    protected function setUp(): void
    {
        $this->dir = sys_get_temp_dir() . '/unicorn-handle-' . uniqid();
        mkdir($this->dir);

        $this->pngPath = $this->dir . '/source.png';
        $this->txtPath = $this->dir . '/source.txt';

        $gd = imagecreatetruecolor(8, 4);
        imagepng($gd, $this->pngPath);

        file_put_contents($this->txtPath, 'plain text content');
    }

    protected function tearDown(): void
    {
        foreach (glob($this->dir . '/*') ?: [] as $file) {
            @unlink($file);
        }

        @rmdir($this->dir);
    }

    private function createStorage(): StorageInterface
    {
        $storage = $this->createStub(StorageInterface::class);
        $storage->method('putStream')->willReturnCallback(
            function (mixed $stream, string $path): PutResult {
                $this->puts[] = ['stream' => $stream, 'path' => $path];

                return new PutResult(
                    uri: new Uri('https://example.com/' . $path),
                    responseCallback: static fn() => null,
                    path: $path,
                );
            }
        );

        return $storage;
    }

    private function createService(array $options = []): FileUploadService
    {
        $storage = $this->createStorage();

        $container = new Container();

        return new class ($container, new ImageRedrawProcessor(sys_get_temp_dir()), $options, MimeTypes::getDefault(), $storage) extends FileUploadService {
            public function __construct(
                Container $container,
                ImageRedrawProcessor $imageProcessor,
                FileUploadOptions|array $options,
                ?\Symfony\Component\Mime\MimeTypesInterface $mimeTypes,
                private readonly StorageInterface $fakeStorage,
            ) {
                parent::__construct($container, $imageProcessor, $options, $mimeTypes);
            }

            public function getStorage(): StorageInterface
            {
                return $this->fakeStorage;
            }
        };
    }

    private function bytesOf(StreamInterface|string $stream): string
    {
        if (is_string($stream)) {
            return $stream;
        }

        $stream->rewind();

        return $stream->getContents();
    }

    #[Test]
    #[TestDox('handleFile() rejects files not matching acceptExtensions / acceptMimeTypes')]
    public function rejectsNotAcceptedFiles(): void
    {
        $service = $this->createService(['acceptExtensions' => ['png', '.JPG']]);

        $service->handleFile($this->pngPath, 'uploads/a.png');
        self::assertCount(1, $this->puts);

        try {
            $service->handleFile($this->txtPath, 'uploads/a.txt');
            self::fail('Expected extension rejection.');
        } catch (\DomainException) {
            self::assertCount(1, $this->puts);
        }

        $service = $this->createService(['acceptMimeTypes' => ['image/*']]);

        try {
            $service->handleFile($this->txtPath, 'uploads/a.txt');
            self::fail('Expected mime rejection.');
        } catch (\DomainException) {
            self::assertCount(1, $this->puts);
        }

        $service->handleFile($this->pngPath, 'uploads/b.png');
        self::assertCount(2, $this->puts);

        $service = $this->createService(['acceptExtensions' => [], 'acceptMimeTypes' => null]);
        $service->handleFile($this->txtPath, 'uploads/c.txt');
        self::assertCount(3, $this->puts);

        foreach (['x.php', 'x.PHTML', 'x.html', 'x.js', 'x.css', 'x.php.jpg'] as $name) {
            try {
                $service->handleFile($this->txtPath, 'uploads/' . $name);
                self::fail('Expected dangerous extension rejection: ' . $name);
            } catch (\DomainException) {
                self::assertCount(3, $this->puts);
            }
        }
    }

    #[Test]
    #[TestDox('handleFile() sanitizes SVG, skips redraw, and minifies it when optimize is enabled')]
    public function sanitizesSvg(): void
    {
        $svgPath = $this->dir . '/evil.svg';
        file_put_contents(
            $svgPath,
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onload="alert(1)">'
            . '<!-- comment --><script>alert(1)</script><rect width="10" height="10" fill="red"/></svg>'
        );

        $service = $this->createService(['resize' => ['enabled' => true], 'optimize' => false]);
        $service->handleFile($svgPath, 'uploads/a.svg');

        $content = $this->bytesOf($this->puts[0]['stream']);
        self::assertStringNotContainsString('<script', $content);
        self::assertStringNotContainsString('onload', $content);
        self::assertStringContainsString('<rect', $content);
        self::assertStringContainsString('<!-- comment -->', $content);

        $service = $this->createService(['optimize' => true]);
        $service->handleFile($svgPath, 'uploads/b.svg');

        $content = $this->bytesOf($this->puts[1]['stream']);
        self::assertStringNotContainsString('<script', $content);
        self::assertStringNotContainsString('comment', $content);

        $service = $this->createService(['sanitizeSvg' => false]);
        $service->handleFile($svgPath, 'uploads/d.svg');
        self::assertStringContainsString('<script', $this->bytesOf($this->puts[2]['stream']));

        file_put_contents($svgPath, '<not-svg');
        $this->expectException(\DomainException::class);
        $this->createService()->handleFile($svgPath, 'uploads/c.svg');
    }

    #[Test]
    #[TestDox('handleFile() stores non-image files as-is')]
    public function storesNonImageAsIs(): void
    {
        $service = $this->createService();

        $result = $service->handleFile($this->txtPath, 'uploads/a.txt');

        self::assertSame('uploads/a.txt', $this->puts[0]['path']);
        self::assertSame('plain text content', $this->bytesOf($this->puts[0]['stream']));
        self::assertSame('uploads/a.txt', $result->path);
    }

    #[Test]
    #[TestDox('handleFile() accepts an SplFileInfo and stores it like a path')]
    public function acceptsSplFileInfo(): void
    {
        $service = $this->createService();

        $service->handleFile(new \SplFileInfo($this->txtPath), 'uploads/a.txt');

        self::assertSame('plain text content', $this->bytesOf($this->puts[0]['stream']));
    }

    #[Test]
    #[TestDox('handleFile() redraws images through GD when resize is enabled')]
    public function redrawsImage(): void
    {
        $service = $this->createService();

        $service->handleFile($this->pngPath, 'uploads/a.png');

        $image = ImageManager::usingDriver(GdDriver::class)->decode($this->bytesOf($this->puts[0]['stream']));
        self::assertSame(8, $image->width());
        self::assertSame('uploads/a.png', $this->puts[0]['path']);
    }

    #[Test]
    #[TestDox('handleFile() converts an image to the destination extension')]
    public function convertsImageToDestinationFormat(): void
    {
        $service = $this->createService();

        $service->handleFile($this->pngPath, 'uploads/a.jpg');

        $bytes = $this->bytesOf($this->puts[0]['stream']);
        self::assertSame("\xFF\xD8", substr($bytes, 0, 2));
    }

    #[Test]
    #[TestDox('handleFile() generates a file name with the source extension when dest is empty')]
    public function generatesDestinationWhenEmpty(): void
    {
        $service = $this->createService(['dir' => 'uploads']);

        $service->handleFile($this->txtPath);

        self::assertMatchesRegularExpression('#^uploads/.+\.txt$#', $this->puts[0]['path']);
    }

    #[Test]
    #[TestDox('handleFile() rejects remote URLs')]
    public function rejectsUrl(): void
    {
        $service = $this->createService();

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Cannot upload file from URL');

        $service->handleFile('https://example.com/a.png', 'uploads/a.png');
    }

    #[Test]
    #[TestDox('handleFile() throws FileUploadException for an uploaded file with an error code')]
    public function throwsForUploadError(): void
    {
        $service = $this->createService();
        $file = new UploadedFile(Utils::streamFor(''), 0, UPLOAD_ERR_INI_SIZE, 'big.png', 'image/png');

        try {
            $service->handleFile($file, 'uploads/a.png');
            self::fail('Expected FileUploadException');
        } catch (FileUploadException $e) {
            self::assertStringContainsString('Upload error', $e->getMessage());
            self::assertSame(UPLOAD_ERR_INI_SIZE, $e->getUploadError());
            self::assertSame($file, $e->getUploadedFile());
        }
    }

    #[Test]
    #[TestDox('handleFile() stores a non-image uploaded file from its stream')]
    public function storesNonImageUpload(): void
    {
        $service = $this->createService();
        $file = new UploadedFile(Utils::streamFor('uploaded text'), 13, UPLOAD_ERR_OK, 'note.txt', 'text/plain');

        $service->handleFile($file, 'uploads/note.txt');

        self::assertSame('uploads/note.txt', $this->puts[0]['path']);
        self::assertSame('uploaded text', $this->bytesOf($this->puts[0]['stream']));
    }

    #[Test]
    #[TestDox('handleFileIfUploaded() returns null when there is no uploaded file')]
    public function ifUploadedReturnsNullWithoutFile(): void
    {
        $service = $this->createService();

        self::assertNull($service->handleFileIfUploaded(null, 'uploads/a.png'));
        self::assertSame([], $this->puts);
    }

    #[Test]
    #[TestDox('handleFileIfUploaded() returns null when the uploaded file has no client filename')]
    public function ifUploadedReturnsNullWithoutFilename(): void
    {
        $service = $this->createService();
        $file = new UploadedFile(Utils::streamFor(''), 0, UPLOAD_ERR_NO_FILE, '', '');

        self::assertNull($service->handleFileIfUploaded($file, 'uploads/a.png'));
    }

    #[Test]
    #[TestDox('handleFileData() stores a string payload')]
    public function handleFileDataString(): void
    {
        $service = $this->createService();

        $service->handleFileData('plain text content', 'uploads/a.txt');

        self::assertSame('uploads/a.txt', $this->puts[0]['path']);
        self::assertSame('plain text content', $this->bytesOf($this->puts[0]['stream']));
    }

    #[Test]
    #[TestDox('handleFileData() stores a PSR-7 stream payload')]
    public function handleFileDataStream(): void
    {
        $service = $this->createService();

        $service->handleFileData(Utils::streamFor('from stream'), 'uploads/a.txt');

        self::assertSame('from stream', $this->bytesOf($this->puts[0]['stream']));
    }

    #[Test]
    #[TestDox('handleFileData() stores a resource payload')]
    public function handleFileDataResource(): void
    {
        $service = $this->createService();
        $handle = fopen($this->txtPath, 'r');

        $service->handleFileData($handle, 'uploads/a.txt');

        self::assertSame('uploads/a.txt', $this->puts[0]['path']);
    }

    #[Test]
    #[TestDox('handleFileData() rejects unsupported payload types')]
    public function handleFileDataRejectsInvalidType(): void
    {
        $service = $this->createService();

        $this->expectException(\InvalidArgumentException::class);

        $service->handleFileData(123, 'uploads/a.txt');
    }

    #[Test]
    #[TestDox('getMimeType() detects the type of a data URI, file path and uploaded file')]
    public function getMimeTypeForSources(): void
    {
        $service = $this->createService();
        $file = new UploadedFile(Utils::streamFor(''), 0, UPLOAD_ERR_OK, 'a.png', 'image/png');

        self::assertSame('image/png', $service->getMimeType($this->pngPath));
        self::assertSame('text/plain', $service->getMimeType($this->txtPath));
        self::assertSame('image/png', $service->getMimeType($file));
        self::assertSame('image/png', $service->getMimeType('data:image/png;base64,AAAA'));
        self::assertNull($service->getMimeType($this->dir . '/missing.png'));
    }

    #[Test]
    #[TestDox('isImage() is true only for image mime types')]
    public function isImageDetection(): void
    {
        $service = $this->createService();

        self::assertTrue($service->isImage($this->pngPath));
        self::assertFalse($service->isImage($this->txtPath));
    }
}

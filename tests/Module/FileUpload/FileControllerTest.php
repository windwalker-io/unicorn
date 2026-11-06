<?php

declare(strict_types=1);

namespace Unicorn\Tests\Module\FileUpload;

use GuzzleHttp\Psr7\Uri;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\UploadedFileInterface;
use Unicorn\Module\FileUpload\FileController;
use Unicorn\Storage\PutResult;
use Unicorn\Upload\FileUploadOptions;
use Unicorn\Upload\FileUploadService;
use Unicorn\Upload\ResizeConfig;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Http\AppRequest;
use Windwalker\DI\Container;
use Windwalker\Http\Helper\UploadedFileHelper;

use function Windwalker\collect;

/**
 * Tests for FileController::upload().
 */
#[AllowMockObjectsWithoutExpectations]
class FileControllerTest extends TestCase
{
    private FileController $controller;

    protected function setUp(): void
    {
        $this->controller = new FileController();
    }

    /**
     * @param  array<string, mixed>  $inputs
     */
    private function createRequest(array $inputs = [], ?UploadedFileInterface $file = null): AppRequest
    {
        $request = $this->createStub(AppRequest::class);

        $request->method('input')->willReturnCallback(
            static function (...$fields) use ($inputs) {
                // The controller reads 4 positional values at once, which must be returned as a list.
                if (count($fields) > 1) {
                    return collect(array_map(static fn($f) => $inputs[$f] ?? null, $fields));
                }

                return $inputs[$fields[0]] ?? null;
            }
        );

        $request->method('file')->willReturn($file);

        return $request;
    }

    private function createContext(?FileUploadService $service, bool $debug = false): AppContext
    {
        $app = $this->createStub(AppContext::class);
        $app->method('retrieve')->willReturn($service);
        $app->method('isDebug')->willReturn($debug);

        return $app;
    }

    /**
     * Creates a real service (constructor skipped) so option/resize state can be inspected,
     * while the actual storage writes are mocked by the caller.
     *
     * @param  list<string>  $mocked
     */
    private function createService(array $mocked = []): FileUploadService
    {
        if ($mocked === []) {
            return new FileUploadService(new Container());
        }

        $service = $this->createPartialMock(FileUploadService::class, $mocked);
        $service->options = new FileUploadOptions();

        return $service;
    }

    private function createUploadedFile(int $error = UPLOAD_ERR_OK): UploadedFileInterface
    {
        $file = $this->createStub(UploadedFileInterface::class);
        $file->method('getError')->willReturn($error);

        return $file;
    }

    private function createPutResult(string $url): PutResult
    {
        $result = $this->createStub(PutResult::class);
        $result->method('getUri')->willReturn(new Uri($url));

        return $result;
    }

    #[Test]
    public function uploadThrowsWhenProfileIsNotFound(): void
    {
        $request = $this->createRequest(['profile' => 'unknown']);
        $app = $this->createContext(null);

        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Unable to find profile: string');
        $this->expectExceptionCode(400);

        $this->controller->upload($request, $app);
    }

    #[Test]
    public function uploadThrowsWhenDataIsNotDataUri(): void
    {
        $request = $this->createRequest(['profile' => 'default', 'data' => 'plain-text']);
        $app = $this->createContext($this->createService(['handleBase64']));

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Invalid file data');
        $this->expectExceptionCode(400);

        $this->controller->upload($request, $app);
    }

    #[Test]
    public function uploadHandsBase64DataToService(): void
    {
        $data = 'data:image/png;base64,' . base64_encode('png-bytes');

        $service = $this->createService(['handleBase64']);
        $service->expects($this->once())
            ->method('handleBase64')
            ->with($data, 'images/a.png')
            ->willReturn($this->createPutResult('https://example.com/images/a.png'));

        $request = $this->createRequest(['profile' => 'default', 'data' => $data, 'path' => 'images/a.png']);

        $result = $this->controller->upload($request, $this->createContext($service));

        self::assertSame(['url' => 'https://example.com/images/a.png'], $result);
    }

    #[Test]
    public function uploadThrowsWhenNoFileIsProvided(): void
    {
        $request = $this->createRequest(['profile' => 'default'], null);
        $app = $this->createContext($this->createService(['handleFile']));

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Upload fail');
        $this->expectExceptionCode(400);

        $this->controller->upload($request, $app);
    }

    #[Test]
    public function uploadDoesNotLeakUploadErrorDetailWhenNotDebug(): void
    {
        $request = $this->createRequest(
            ['profile' => 'default'],
            $this->createUploadedFile(UPLOAD_ERR_INI_SIZE)
        );
        $app = $this->createContext($this->createService(['handleFile']), debug: false);

        try {
            $this->controller->upload($request, $app);
            self::fail('Exception expected.');
        } catch (\RuntimeException $e) {
            self::assertSame('Upload fail', $e->getMessage());
        }
    }

    #[Test]
    public function uploadIncludesUploadErrorDetailWhenDebug(): void
    {
        $request = $this->createRequest(
            ['profile' => 'default'],
            $this->createUploadedFile(UPLOAD_ERR_INI_SIZE)
        );
        $app = $this->createContext($this->createService(['handleFile']), debug: true);

        try {
            $this->controller->upload($request, $app);
            self::fail('Exception expected.');
        } catch (\RuntimeException $e) {
            self::assertSame(
                'Upload fail: ' . UploadedFileHelper::getUploadMessage(UPLOAD_ERR_INI_SIZE),
                $e->getMessage()
            );
        }
    }

    #[Test]
    public function uploadHandsUploadedFileToService(): void
    {
        $file = $this->createUploadedFile();

        $service = $this->createService(['handleFile']);
        $service->expects($this->once())
            ->method('handleFile')
            ->with($file, 'docs/a.txt')
            ->willReturn($this->createPutResult('https://example.com/docs/a.txt'));

        $request = $this->createRequest(
            ['profile' => 'default', 'path' => 'docs/a.txt'],
            $file
        );

        $result = $this->controller->upload($request, $this->createContext($service));

        self::assertSame(['url' => 'https://example.com/docs/a.txt'], $result);
    }

    #[Test]
    public function uploadAppliesDirOption(): void
    {
        $service = $this->createService(['handleFile']);
        $service->method('handleFile')->willReturn($this->createPutResult('https://example.com/a'));

        $request = $this->createRequest(
            ['profile' => 'default', 'dir' => 'custom/dir'],
            $this->createUploadedFile()
        );

        $this->controller->upload($request, $this->createContext($service));

        self::assertSame('custom/dir', $service->options->dir);
    }

    #[Test]
    public function uploadEnablesResizeWithSizeString(): void
    {
        $service = $this->createService(['handleFile']);
        $service->method('handleFile')->willReturn($this->createPutResult('https://example.com/a'));

        $request = $this->createRequest(
            ['profile' => 'default', 'resize' => '1', 'size' => '100x50', 'quality' => '80', 'crop' => '1'],
            $this->createUploadedFile()
        );

        $this->controller->upload($request, $this->createContext($service));

        $config = $service->getResizeConfig();

        self::assertTrue($config->enabled);
        self::assertSame(100, $config->width);
        self::assertSame(50, $config->height);
        self::assertSame(80, $config->quality);
        self::assertTrue($config->crop);
    }

    #[Test]
    public function uploadPrefersExplicitWidthAndHeightOverSize(): void
    {
        $service = $this->createService(['handleFile']);
        $service->method('handleFile')->willReturn($this->createPutResult('https://example.com/a'));

        $request = $this->createRequest(
            ['profile' => 'default', 'resize' => '1', 'size' => '100x50', 'width' => '300', 'height' => '200'],
            $this->createUploadedFile()
        );

        $this->controller->upload($request, $this->createContext($service));

        self::assertSame(300, $service->getResizeConfig()->width);
        self::assertSame(200, $service->getResizeConfig()->height);
    }

    #[Test]
    public function uploadKeepsProfileQualityWhenQualityIsNotProvided(): void
    {
        $service = $this->createService(['handleFile']);
        $service->options->resize = new ResizeConfig(quality: 70);
        $service->method('handleFile')->willReturn($this->createPutResult('https://example.com/a'));

        $request = $this->createRequest(
            ['profile' => 'default', 'resize' => '1', 'size' => '100x50'],
            $this->createUploadedFile()
        );

        $this->controller->upload($request, $this->createContext($service));

        self::assertSame(70, $service->getResizeConfig()->quality);
        self::assertSame(100, $service->getResizeConfig()->width);
    }

    #[Test]
    public function uploadDisablesResizeWhenResizeIsZero(): void
    {
        $service = $this->createService(['handleFile']);
        $service->method('handleFile')->willReturn($this->createPutResult('https://example.com/a'));

        $request = $this->createRequest(
            ['profile' => 'default', 'resize' => '0'],
            $this->createUploadedFile()
        );

        $this->controller->upload($request, $this->createContext($service));

        self::assertFalse($service->getResizeConfig()->enabled);
    }
}

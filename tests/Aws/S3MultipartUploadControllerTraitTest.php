<?php

declare(strict_types=1);

namespace Unicorn\Tests\Aws;

use Aws\Result;
use GuzzleHttp\Psr7\Request;
use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Aws\S3MultipartUploadControllerTrait;
use Unicorn\Aws\S3MultipartUploader;
use Windwalker\Core\Application\ApplicationInterface;

/**
 * Test controller that exposes the trait's protected uploader factory.
 *
 * Keep this fixture while tests exercise S3MultipartUploadControllerTrait.
 */
final class S3MultipartUploadControllerFixture
{
    use S3MultipartUploadControllerTrait;

    public int $configureCallCount = 0;

    public function __construct(ApplicationInterface $app)
    {
        $this->app = $app;
    }

    public function setUploader(S3MultipartUploader $uploader): void
    {
        $this->uploader = $uploader;
    }

    public function resolveUploader(): S3MultipartUploader
    {
        return $this->getS3MultipartUploader();
    }

    protected function configureUploader(S3MultipartUploader $uploader): void
    {
        $this->configureCallCount++;
    }
}

/**
 * Verifies multipart upload controller actions and error cleanup without
 * booting an application or calling an external storage service.
 */
final class S3MultipartUploadControllerTraitTest extends TestCase
{
    private S3MultipartUploadControllerFixture $controller;

    #[Before]
    public function initializeApplication(): void
    {
        $this->controller = new S3MultipartUploadControllerFixture(
            $this->createStub(ApplicationInterface::class)
        );
    }

    #[Test]
    public function getS3MultipartUploaderConfiguresAndCachesTheUploader(): void
    {
        $first = $this->controller->resolveUploader();
        $second = $this->controller->resolveUploader();

        self::assertSame($first, $second);
        self::assertSame(1, $this->controller->configureCallCount);
    }

    #[Test]
    public function initDelegatesArgumentsAndReturnsTheUploadId(): void
    {
        $uploader = $this->createMock(S3MultipartUploader::class);
        $uploader->expects($this->once())
            ->method('initWithFilename')
            ->with('media/video.mp4', 'holiday video.mp4', ['ContentType' => 'video/mp4'], 'primary')
            ->willReturn('upload-123');
        $this->controller->setUploader($uploader);

        self::assertSame(
            ['id' => 'upload-123'],
            $this->controller->init(
                'media/video.mp4',
                'holiday video.mp4',
                ['ContentType' => 'video/mp4'],
                'primary'
            )
        );
    }

    #[Test]
    public function signReturnsThePresignedRequestUri(): void
    {
        $request = new Request('PUT', 'https://storage.example.test/signed-part');
        $uploader = $this->createMock(S3MultipartUploader::class);
        $uploader->expects($this->once())
            ->method('sign')
            ->with('upload-123', 'media/video.mp4', 3, 'primary')
            ->willReturn($request);
        $this->controller->setUploader($uploader);

        self::assertSame(
            ['url' => 'https://storage.example.test/signed-part'],
            $this->controller->sign('upload-123', 'media/video.mp4', 3, 'primary')
        );
    }

    #[Test]
    public function signAbortsTheUploadAndRethrowsWhenSigningFails(): void
    {
        $exception = new \RuntimeException('Unable to sign upload part.');
        $uploader = $this->createMock(S3MultipartUploader::class);
        $uploader->expects($this->once())
            ->method('sign')
            ->with('upload-123', 'media/video.mp4', 3, 'primary')
            ->willThrowException($exception);
        $uploader->expects($this->once())
            ->method('abort')
            ->with('upload-123', 'media/video.mp4', 'primary');
        $this->controller->setUploader($uploader);

        try {
            $this->controller->sign('upload-123', 'media/video.mp4', 3, 'primary');
            self::fail('Expected the signing exception to be rethrown.');
        } catch (\RuntimeException $caught) {
            self::assertSame($exception, $caught);
        }
    }

    #[Test]
    public function completeReturnsTheObjectUrlAndUploadedPaths(): void
    {
        $parts = [['PartNumber' => 1, 'ETag' => '"part-one"']];
        $uploader = $this->createMock(S3MultipartUploader::class);
        $uploader->expects($this->once())
            ->method('complete')
            ->with('upload-123', 'media/video.mp4', $parts, 'primary')
            ->willReturn(new Result([
                'ObjectURL' => 'https://storage.example.test/media/video.mp4',
                'Key' => 'media/video.mp4',
            ]));
        $this->controller->setUploader($uploader);

        self::assertSame(
            [
                'url' => 'https://storage.example.test/media/video.mp4',
                'path' => 'media/video.mp4',
                'fullPath' => 'media/video.mp4',
            ],
            $this->controller->complete('upload-123', 'media/video.mp4', $parts, 'primary')
        );
    }

    #[Test]
    public function completeAddsHttpsWhenTheReturnedObjectUrlHasNoScheme(): void
    {
        $uploader = $this->createStub(S3MultipartUploader::class);
        $uploader->method('complete')->willReturn(new Result([
            'ObjectURL' => 'storage.example.test/media/video.mp4',
            'Key' => 'media/video.mp4',
        ]));
        $this->controller->setUploader($uploader);

        self::assertSame(
            'https://storage.example.test/media/video.mp4',
            $this->controller->complete('upload-123', 'media/video.mp4', [])['url']
        );
    }

    #[Test]
    public function completeAbortsTheUploadAndRethrowsWhenCompletionFails(): void
    {
        $exception = new \RuntimeException('Unable to complete upload.');
        $uploader = $this->createMock(S3MultipartUploader::class);
        $uploader->expects($this->once())
            ->method('complete')
            ->with('upload-123', 'media/video.mp4', [], 'primary')
            ->willThrowException($exception);
        $uploader->expects($this->once())
            ->method('abort')
            ->with('upload-123', 'media/video.mp4', 'primary');
        $this->controller->setUploader($uploader);

        try {
            $this->controller->complete('upload-123', 'media/video.mp4', [], 'primary');
            self::fail('Expected the completion exception to be rethrown.');
        } catch (\RuntimeException $caught) {
            self::assertSame($exception, $caught);
        }
    }

    #[Test]
    public function abortDelegatesToUploaderAndReturnsTrue(): void
    {
        $uploader = $this->createMock(S3MultipartUploader::class);
        $uploader->expects($this->once())
            ->method('abort')
            ->with('upload-123', 'media/video.mp4', 'primary');
        $this->controller->setUploader($uploader);

        self::assertTrue($this->controller->abort('upload-123', 'media/video.mp4', 'primary'));
    }
}

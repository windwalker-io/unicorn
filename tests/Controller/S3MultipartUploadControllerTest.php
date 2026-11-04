<?php

declare(strict_types=1);

namespace Unicorn\Tests\Controller;

use PHPUnit\Framework\Attributes\Before;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Aws\S3MultipartUploader;
use Unicorn\Controller\S3MultipartUploadController;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Http\AppRequest;
use Windwalker\Core\Router\Route;

/**
 * Verifies the S3 multipart upload controller only invokes the
 * route-provided configuration callback when it is actually reachable,
 * without booting a real application or AWS client.
 */
final class S3MultipartUploadControllerTest extends TestCase
{
    private S3MultipartUploadController $controller;

    #[Before]
    public function initializeController(): void
    {
        $this->controller = new S3MultipartUploadController();
    }

    #[Test]
    public function configureUploaderDoesNothingWhenAppRequestServiceIsUnavailable(): void
    {
        $app = $this->createMock(ApplicationInterface::class);
        $app->expects($this->once())
            ->method('hasService')
            ->with(AppRequest::class)
            ->willReturn(false);
        $app->expects($this->never())->method('retrieve');

        $this->setAppProperty($app);

        $this->invokeConfigureUploader($this->createStub(S3MultipartUploader::class));
    }

    #[Test]
    public function configureUploaderDoesNothingWhenThereIsNoMatchedRoute(): void
    {
        $appRequest = $this->createMock(AppRequest::class);
        $appRequest->expects($this->once())->method('getMatchedRoute')->willReturn(null);

        $app = $this->createMock(ApplicationInterface::class);
        $app->expects($this->once())->method('hasService')->with(AppRequest::class)->willReturn(true);
        $app->expects($this->once())->method('retrieve')->with(AppRequest::class)->willReturn($appRequest);

        $this->setAppProperty($app);

        $this->invokeConfigureUploader($this->createStub(S3MultipartUploader::class));
    }

    #[Test]
    public function configureUploaderIgnoresNonClosureExtraValues(): void
    {
        $this->expectNotToPerformAssertions();

        $route = new Route('test')->extraValues(['configureUploader' => 'not-a-closure']);

        $appRequest = $this->createStub(AppRequest::class);
        $appRequest->method('getMatchedRoute')->willReturn($route);

        $app = $this->createStub(ApplicationInterface::class);
        $app->method('hasService')->willReturn(true);
        $app->method('retrieve')->willReturn($appRequest);

        $this->setAppProperty($app);

        $this->invokeConfigureUploader($this->createStub(S3MultipartUploader::class));
    }

    #[Test]
    public function configureUploaderInvokesTheRouteProvidedClosureWithTheUploader(): void
    {
        $uploader = $this->createStub(S3MultipartUploader::class);
        $received = null;

        $route = new Route('test')->extraValues(
            [
                'configureUploader' => function (S3MultipartUploader $u) use (&$received): void {
                    $received = $u;
                },
            ]
        );

        $appRequest = $this->createStub(AppRequest::class);
        $appRequest->method('getMatchedRoute')->willReturn($route);

        $app = $this->createStub(ApplicationInterface::class);
        $app->method('hasService')->willReturn(true);
        $app->method('retrieve')->willReturn($appRequest);

        $this->setAppProperty($app);

        $this->invokeConfigureUploader($uploader);

        self::assertSame($uploader, $received);
    }

    private function setAppProperty(ApplicationInterface $app): void
    {
        new \ReflectionProperty($this->controller, 'app')->setValue($this->controller, $app);
    }

    private function invokeConfigureUploader(S3MultipartUploader $uploader): void
    {
        $method = new \ReflectionMethod($this->controller, 'configureUploader');
        $method->invoke($this->controller, $uploader);
    }
}

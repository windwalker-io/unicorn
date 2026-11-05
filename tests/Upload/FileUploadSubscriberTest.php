<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use GuzzleHttp\Psr7\Uri;
use GuzzleHttp\Psr7\Utils;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Unicorn\Storage\PutResult;
use Unicorn\Upload\Event\FileUploadedEvent;
use Unicorn\Upload\FileUploadOptions;
use Unicorn\Upload\FileUploadSubscriber;
use Windwalker\Core\Router\SystemUri;

/**
 * Tests for FileUploadSubscriber making the stored URI relative to the site root.
 */
class FileUploadSubscriberTest extends TestCase
{
    private function createEvent(string $uri): FileUploadedEvent
    {
        $result = new PutResult(
            uri: new Uri($uri),
            responseCallback: static fn() => null,
            path: 'uploads/a.png',
        );

        return new FileUploadedEvent(
            file: 'a.png',
            result: $result,
            stream: Utils::streamFor(''),
            options: new FileUploadOptions(),
            dest: 'uploads/a.png',
        );
    }

    #[Test]
    #[TestDox('fileUploaded() strips the system root from the stored URI')]
    public function stripsSystemRoot(): void
    {
        $subscriber = new FileUploadSubscriber(new SystemUri('https://example.com/app/index.php'));
        $event = $this->createEvent('https://example.com/app/index.php/uploads/a.png');

        $subscriber->fileUploaded($event);

        self::assertSame('uploads/a.png', (string) $event->result->uri);
    }

    #[Test]
    #[TestDox('fileUploaded() keeps URIs outside the system root unchanged')]
    public function keepsExternalUri(): void
    {
        $subscriber = new FileUploadSubscriber(new SystemUri('https://example.com/app/index.php'));
        $event = $this->createEvent('https://cdn.example.net/uploads/a.png');

        $subscriber->fileUploaded($event);

        self::assertSame('https://cdn.example.net/uploads/a.png', (string) $event->result->uri);
    }
}

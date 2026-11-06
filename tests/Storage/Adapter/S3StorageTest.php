<?php

declare(strict_types=1);

namespace Unicorn\Tests\Storage\Adapter;

use Aws\Result as AwsResult;
use GuzzleHttp\Psr7\Utils;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mime\MimeTypes;
use Unicorn\Aws\S3Service;
use Unicorn\Storage\Adapter\S3Storage;
use Windwalker\Uri\Uri;

/**
 * Covers S3Storage's mapping onto S3Service. The S3Service is mocked, so no AWS account or network is needed.
 */
final class S3StorageTest extends TestCase
{
    private S3Service&\PHPUnit\Framework\MockObject\MockObject $s3;

    private S3Storage $storage;

    protected function setUp(): void
    {
        $this->s3 = $this->createMock(S3Service::class);
        $this->storage = new S3Storage($this->s3, MimeTypes::getDefault());
    }

    #[Test]
    public function putGuessesContentTypeFromPathAndUploadsData(): void
    {
        $this->s3->expects($this->once())
            ->method('uploadFileData')
            ->with(
                'hello',
                'images/a.png',
                $this->callback(
                    static fn(array $options) => $options['ContentType'] === 'image/png'
                        && $options['ContentLength'] === 5
                )
            )
            ->willReturn(new AwsResult(['ObjectURL' => 'https://bucket.example.com/images/a.png']));

        $result = $this->storage->put('hello', 'images/a.png');

        self::assertSame('images/a.png', $result->path);
        self::assertSame(5, $result->fileSize);
        self::assertSame('https://bucket.example.com/images/a.png', (string) $result->uri);
    }

    #[Test]
    public function putUsesExplicitMimeTypeOverGuess(): void
    {
        $this->s3->expects($this->once())
            ->method('uploadFileData')
            ->with(
                'data',
                'a.bin',
                $this->callback(static fn(array $options) => $options['ContentType'] === 'text/plain')
            )
            ->willReturn(new AwsResult(['ObjectURL' => 'https://bucket.example.com/a.bin']));

        $this->storage->put('data', 'a.bin', ['mime_type' => 'text/plain']);
    }

    #[Test]
    public function putFileUsesSourceFileSizeAndUploadsFile(): void
    {
        $src = tempnam(sys_get_temp_dir(), 's3-src-');
        file_put_contents($src, '1234567');

        try {
            $this->s3->expects($this->once())
                ->method('uploadFile')
                ->with(
                    $src,
                    'docs/readme.txt',
                    $this->callback(static fn(array $options) => $options['ContentLength'] === 7)
                )
                ->willReturn(new AwsResult(['ObjectURL' => 'https://bucket.example.com/docs/readme.txt']));

            $result = $this->storage->putFile($src, 'docs/readme.txt');

            self::assertSame(7, $result->fileSize);
            self::assertSame('docs/readme.txt', $result->path);
        } finally {
            @unlink($src);
        }
    }

    #[Test]
    public function putStreamReadsSizeFromPsr7Stream(): void
    {
        $stream = Utils::streamFor('abcdef');

        $this->s3->expects($this->once())
            ->method('uploadFileData')
            ->with(
                $stream,
                'b.txt',
                $this->callback(static fn(array $options) => $options['ContentLength'] === 6)
            )
            ->willReturn(new AwsResult(['ObjectURL' => 'https://bucket.example.com/b.txt']));

        $result = $this->storage->putStream($stream, 'b.txt');

        self::assertSame(6, $result->fileSize);
    }

    #[Test]
    public function deleteDelegatesToS3AndReturnsSdkResult(): void
    {
        $awsResult = new AwsResult(['@metadata' => ['statusCode' => 204, 'headers' => []]]);

        $this->s3->expects($this->once())
            ->method('deleteFile')
            ->with('old/file.txt', [])
            ->willReturn($awsResult);

        $result = $this->storage->delete('old/file.txt');

        self::assertSame($awsResult, $result->rawResult);
    }

    #[Test]
    public function getUriPassesPathStyleOption(): void
    {
        $this->s3->expects($this->once())
            ->method('getUri')
            ->with('a/b.jpg', true)
            ->willReturn(new Uri('https://s3.example.com/bucket/a/b.jpg'));

        $uri = $this->storage->getUri('a/b.jpg', ['pathStyle' => true]);

        self::assertSame('https://s3.example.com/bucket/a/b.jpg', (string) $uri);
    }

    #[Test]
    public function getBuildsResultFromFileInfo(): void
    {
        $info = new AwsResult(
            [
                'ContentLength' => 42,
                'LastModified' => 1700000000,
                'Body' => Utils::streamFor('content'),
                '@metadata' => ['statusCode' => 200, 'headers' => ['content-type' => ['text/plain']]],
            ]
        );

        $this->s3->expects($this->once())
            ->method('getFileInfo')
            ->with('c.txt', [])
            ->willReturn($info);
        $this->s3->method('getUri')
            ->willReturn(new Uri('https://bucket.example.com/c.txt'));

        $result = $this->storage->get('c.txt');

        self::assertSame('c.txt', $result->path);
        self::assertSame(42, $result->fileSize);
        self::assertSame(1700000000, $result->lastModified->getTimestamp());
        self::assertSame('content', (string) $result->body);
    }

    #[Test]
    public function readReturnsObjectContents(): void
    {
        $this->s3->expects($this->once())
            ->method('getFileInfo')
            ->willReturn(
                new AwsResult(
                    [
                        'ContentLength' => 3,
                        'Body' => Utils::streamFor('xyz'),
                        '@metadata' => ['statusCode' => 200, 'headers' => []],
                    ]
                )
            );
        $this->s3->method('getUri')
            ->willReturn(new Uri('https://bucket.example.com/d.txt'));

        self::assertSame('xyz', $this->storage->read('d.txt'));
    }

    #[Test]
    public function existsDelegatesToS3Service(): void
    {
        $this->s3->expects($this->exactly(2))
            ->method('exists')
            ->willReturnOnConsecutiveCalls(true, false);

        self::assertTrue($this->storage->exists('yes.txt'));
        self::assertFalse($this->storage->exists('no.txt'));
    }

    #[Test]
    public function guessMimeTypeReturnsNullWhenExtensionIsUnknown(): void
    {
        $this->s3->expects($this->once())
            ->method('uploadFileData')
            ->with(
                'x',
                'noextension',
                $this->callback(static fn(array $options) => !array_key_exists('ContentType', $options)
                    || $options['ContentType'] === null)
            )
            ->willReturn(new AwsResult(['ObjectURL' => 'https://bucket.example.com/noextension']));

        $this->storage->put('x', 'noextension');
    }
}

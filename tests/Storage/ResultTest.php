<?php

declare(strict_types=1);

namespace Unicorn\Tests\Storage;

use GuzzleHttp\Psr7\Uri;
use GuzzleHttp\Psr7\Utils;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Storage\GetResult;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\Result;
use Windwalker\Http\Response\Response;

/**
 * Covers the lazy response handling and derived properties of the storage result objects.
 */
final class ResultTest extends TestCase
{
    #[Test]
    public function responseIsResolvedLazilyAndCachedAcrossAccesses(): void
    {
        $calls = 0;
        $result = new Result(
            static function () use (&$calls) {
                $calls++;

                return new Response(Utils::streamFor('hello'));
            }
        );

        self::assertSame(0, $calls);

        $first = $result->response;
        $second = $result->response;

        self::assertSame(1, $calls);
        self::assertSame($first, $second);
    }

    #[Test]
    public function bodyReadsFromTheResolvedResponse(): void
    {
        $result = new Result(static fn() => new Response(Utils::streamFor('hello world')));

        self::assertSame('hello world', (string) $result->body);
        self::assertSame('hello world', (string) $result->getBody());
    }

    #[Test]
    public function putResultFilenameAndExtensionPreferPath(): void
    {
        $result = new PutResult(
            uri: new Uri('https://example.com/other/ignored.jpg'),
            responseCallback: static fn() => null,
            path: 'uploads/photo.png',
        );

        self::assertSame('photo.png', $result->filename);
        self::assertSame('png', $result->extension);
    }

    #[Test]
    public function putResultFilenameFallsBackToUriWhenPathIsMissing(): void
    {
        $result = new PutResult(
            uri: new Uri('https://example.com/uploads/doc.pdf'),
            responseCallback: static fn() => null,
        );

        self::assertSame('doc.pdf', $result->filename);
        self::assertSame('pdf', $result->extension);
    }

    #[Test]
    public function putResultGetUriReturnsOriginalUriWithoutSuffix(): void
    {
        $result = new PutResult(
            uri: new Uri('https://example.com/a.png?x=1'),
            responseCallback: static fn() => null,
        );

        self::assertSame('https://example.com/a.png?x=1', $result->getUriString());
        self::assertSame('https://example.com/a.png?x=1', (string) $result);
    }

    #[Test]
    public function putResultGetUriAppendsSuffixToQuery(): void
    {
        $result = new PutResult(
            uri: new Uri('https://example.com/a.png'),
            responseCallback: static fn() => null,
        );

        self::assertSame('https://example.com/a.png?v=2', $result->getUriString('v=2'));
    }

    #[Test]
    public function putResultGetUriJoinsSuffixWithExistingQuery(): void
    {
        $result = new PutResult(
            uri: new Uri('https://example.com/a.png?x=1'),
            responseCallback: static fn() => null,
        );

        self::assertSame('https://example.com/a.png?x=1&v=2', $result->getUriString('v=2'));
    }

    #[Test]
    public function putResultGetUriWithTrueSuffixAddsUniqueId(): void
    {
        $result = new PutResult(
            uri: new Uri('https://example.com/a.png'),
            responseCallback: static fn() => null,
        );

        $first = $result->getUriString(true);
        $second = $result->getUriString(true);

        self::assertMatchesRegularExpression('/^https:\/\/example\.com\/a\.png\?.+$/', $first);
        self::assertNotSame($first, $second);
    }

    #[Test]
    public function getResultConvertsIntegerLastModifiedToDateTime(): void
    {
        $result = $this->createGetResult(1700000000);

        self::assertInstanceOf(\DateTimeImmutable::class, $result->lastModified);
        self::assertSame(1700000000, $result->lastModified->getTimestamp());
    }

    #[Test]
    public function getResultConvertsStringLastModifiedToDateTime(): void
    {
        $result = $this->createGetResult('2024-01-02 03:04:05 UTC');

        self::assertInstanceOf(\DateTimeImmutable::class, $result->lastModified);
        self::assertSame('2024-01-02 03:04:05', $result->lastModified->format('Y-m-d H:i:s'));
    }

    #[Test]
    public function getResultConvertsFalseLastModifiedToNull(): void
    {
        $result = $this->createGetResult(false);

        self::assertNull($result->lastModified);
    }

    #[Test]
    public function getResultKeepsDateTimeLastModifiedAsIs(): void
    {
        $date = new \DateTimeImmutable('2020-05-05 00:00:00');
        $result = $this->createGetResult($date);

        self::assertSame($date, $result->lastModified);
    }

    private function createGetResult(\DateTimeInterface|int|string|false|null $lastModified = null): GetResult
    {
        return new GetResult(
            responseCallback: static fn() => null,
            path: 'a.txt',
            uri: new Uri('https://example.com/a.txt'),
            fileSize: 10,
            lastModified: $lastModified,
        );
    }
}

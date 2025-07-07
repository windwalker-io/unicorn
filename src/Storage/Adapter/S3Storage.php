<?php

declare(strict_types=1);

namespace Unicorn\Storage\Adapter;

use Aws\Result as AwsResult;
use GuzzleHttp\Psr7\MimeType;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Symfony\Component\Mime\MimeTypesInterface;
use Unicorn\Aws\S3Service;
use Unicorn\Storage\GetResult;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\Result;
use Unicorn\Storage\StorageInterface;
use Windwalker\Filesystem\Path;
use Windwalker\Http\Response\Response;
use Windwalker\Uri\Uri;
use Windwalker\Utilities\Str;

/**
 * The S3Adapter class.
 */
class S3Storage implements StorageInterface
{
    /**
     * S3Storage constructor.
     */
    public function __construct(protected S3Service $s3, protected MimeTypesInterface $mimeTypes)
    {
    }

    public function put(string $data, string $path, array $options = []): PutResult
    {
        $mime = $options['ContentType'] = $options['mime_type'] ?? $this->guessMimeType($path);
        $size = $options['ContentLength'] = strlen($data);

        $result = $this->s3->uploadFileData(
            $data,
            $path,
            $options
        );

        return $this->createPutResult($result, (int) $size, $path);
    }

    public function putFile(string $src, string $path, array $options = []): PutResult
    {
        $mime = $options['ContentType'] = $options['mime_type'] ?? $this->guessMimeType($src);
        $size = $options['ContentLength'] = filesize($src);

        $result = $this->s3->uploadFile(
            $src,
            $path,
            $options
        );

        return $this->createPutResult($result, (int) $size, $path);
    }

    public function createPutResult(AwsResult $result, int $size, string $path): PutResult
    {
        $result = new PutResult(
            uri: new Uri($result->get('ObjectURL')),
            path: $path,
            responseCallback: fn () => $this->createResponseFromResult($result),
            rawResult: $result,
            fileSize: $size
        );

        return $result;
    }

    private function createResponseFromResult(AwsResult $result): ResponseInterface
    {
        $metadata = $result->get('@metadata');

        return new Response(
            $result->get('Body') ?? 'php://memory',
            $metadata['statusCode'],
            $metadata['headers'],
        );
    }

    public function putStream(mixed $src, string $path, array $options = []): PutResult
    {
        $mime = $options['ContentType'] = $options['mime_type'] ?? $this->guessMimeType($path);
        $size = 0;

        if ($src instanceof StreamInterface) {
            $size = $options['ContentLength'] = $src->getSize();
        } elseif (is_resource($src)) {
            $stats = fstat($src);

            $size = $options['ContentLength'] = $stats['size'] ?? null;
        }

        $result = $this->s3->uploadFileData(
            $src,
            $path,
            $options
        );

        return $this->createPutResult($result, (int) $size, $path);
    }

    public function delete(string $path, array $options = []): Result
    {
        $result = $this->s3->deleteFile($path, $options);

        return new Result(
            fn () => $this->createResponseFromResult($result),
            $result
        );
    }

    public function getUri(string $path, array $options = []): UriInterface
    {
        return $this->s3->getUri($path, $options['pathStyle'] ?? false);
    }

    public function get(string $path, array $options = []): GetResult
    {
        $result = $this->s3->getFileInfo($path, $options);

        return new GetResult(
            responseCallback: fn () => $this->createResponseFromResult($result),
            path: $path,
            uri: $this->getUri($path),
            fileSize: $result->get('ContentLength'),
            lastModified: $result->get('LastModified'),
            rawResult: $result
        );
    }

    public function read(string $path, array $options = []): string
    {
        return $this->readStream($path, $options)->getContents();
    }

    public function readStream(string $path, array $options = []): StreamInterface
    {
        return $this->get($path, $options)->getBody();
    }

    public function listContents(string $path, bool $recursive = false): iterable
    {
        $options = [];

        if ($recursive === false) {
            $options['Delimiter'] = '/';
            Str::ensureRight($path, '/');
        }

        foreach ($this->s3->listObjects($path, $options) as $k => $listObject) {
            yield $k => new GetResult(
                responseCallback: fn() => $this->get($listObject['Key'])->response,
                path: $listObject['Key'],
                uri: $listObject['Uri'],
                fileSize: (int) $listObject['Size'],
                lastModified: $listObject['LastModified'],
                rawResult: $listObject
            );
        }
    }

    public function exists(string $path): bool
    {
        return $this->s3->exists($path);
    }

    /**
     * @return S3Service
     */
    public function getS3Service(): S3Service
    {
        return $this->s3;
    }

    protected function guessMimeType(string $path): ?string
    {
        return $this->mimeTypes->getMimeTypes(Path::getExtension($path))[0] ?? null;
    }
}

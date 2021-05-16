<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Storage\Adapter;

use Aws\Result as AwsResult;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UriInterface;
use Unicorn\Aws\S3Service;
use Unicorn\Storage\GetResult;
use Unicorn\Storage\PutResult;
use Unicorn\Storage\Result;
use Unicorn\Storage\StorageInterface;
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
    public function __construct(protected S3Service $s3)
    {
    }

    public function put(string $data, string $path, array $options = []): PutResult
    {
        $result = $this->s3->uploadFileData(
            $data,
            $path,
            $options
        );

        return $this->createPutResult($result);
    }

    public function putFile(string $src, string $path, array $options = []): PutResult
    {
        $result = $this->s3->uploadFile(
            $src,
            $path,
            $options
        );

        return $this->createPutResult($result);
    }

    public function createPutResult(AwsResult $result): PutResult
    {
        return new PutResult(
            new Uri($result->get('ObjectURL')),
            fn () => $this->createResponseFromResult($result),
            $result
        );
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
        $result = $this->s3->uploadFileData(
            $src,
            $path,
            $options
        );

        return $this->createPutResult($result);
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

        return (new GetResult(
            fn () => $this->createResponseFromResult($result),
            $result
        ))
            ->setUri($this->getUri($path))
            ->setPath($path)
            ->setLastModified($result->get('LastModified'))
            ->setFileSize($result->get('ContentLength'));
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
            yield $k => (new GetResult(
                fn() => $this->get($listObject['Key'])->getResponse(),
                $listObject
            ))
                ->setUri($listObject['Uri'])
                ->setPath($listObject['Key'])
                ->setLastModified($listObject['LastModified'])
                ->setFileSize((int) $listObject['Size']);
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
}

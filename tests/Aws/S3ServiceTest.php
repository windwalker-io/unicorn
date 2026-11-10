<?php

declare(strict_types=1);

namespace Unicorn\Tests\Aws;

use Aws\MockHandler;
use Aws\Result;
use Aws\S3\S3Client;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Aws\S3Service;

/**
 * Covers S3 request construction and URL/path handling with the AWS SDK's
 * in-memory handler; no AWS account or network is needed.
 */
final class S3ServiceTest extends TestCase
{
    #[Test]
    public function getObjectPassesArgumentsToTheClient(): void
    {
        $result = new Result(['ContentLength' => 12]);
        [$service, $handler] = $this->createService([$result]);
        $args = ['Bucket' => 'test-bucket', 'Key' => 'folder/file.txt'];

        self::assertSame($result, $service->getObject($args));
        self::assertSame('GetObject', $handler->getLastCommand()->getName());
        self::assertSame($args, $this->commandArguments($handler));
    }

    #[Test]
    public function getFileInfoAddsTheKeyWithoutDiscardingOtherArguments(): void
    {
        [$service, $handler] = $this->createService([new Result()]);

        $service->getFileInfo('folder/file.txt', ['Bucket' => 'test-bucket', 'Range' => 'bytes=0-9']);

        self::assertSame(
            [
                'Bucket' => 'test-bucket',
                'Range' => 'bytes=0-9',
                'Key' => 'folder/file.txt',
            ],
            $this->commandArguments($handler)
        );
    }

    #[Test]
    public function getPreSignedUrlUsesTheObjectKeyAndExpiration(): void
    {
        [$service] = $this->createService();

        $uri = $service->getPreSignedUrl(
            'https://test-bucket.s3.us-east-1.amazonaws.com/assets/photo.jpg',
            '+5 minutes',
            ['Bucket' => 'test-bucket']
        );
        parse_str($uri->getQuery(), $query);

        self::assertSame('/assets/photo.jpg', $uri->getPath());
        self::assertSame('300', $query['X-Amz-Expires']);
    }

    #[Test]
    public function getPreSignedUrlWithFilenameEncodesTheDispositionFilename(): void
    {
        [$service] = $this->createService();

        $uri = $service->getPreSignedUrlWithFilename(
            'https://test-bucket.s3.us-east-1.amazonaws.com/reports/summary.pdf',
            '+5 minutes',
            'quarterly report.pdf',
            ['Bucket' => 'test-bucket']
        );
        parse_str($uri->getQuery(), $query);

        self::assertSame('/reports/summary.pdf', $uri->getPath());
        self::assertSame(
            "attachment; filename*=UTF-8''quarterly%20report.pdf",
            $query['response-content-disposition']
        );
        self::assertSame('300', $query['X-Amz-Expires']);
    }

    #[Test]
    public function getPreSignedUrlSignsCloudfrontPathWithTheConfiguredKeyPair(): void
    {
        $key = openssl_pkey_new(['private_key_type' => OPENSSL_KEYTYPE_RSA, 'private_key_bits' => 2048]);
        if ($key === false) {
            $this->markTestSkipped('The local OpenSSL configuration cannot generate a signing key.');
        }

        self::assertTrue(openssl_pkey_export($key, $privateKey));
        $privateKeyPath = tempnam(sys_get_temp_dir(), 's3-cloudfront-key-');
        self::assertNotFalse($privateKeyPath);

        try {
            self::assertNotFalse(file_put_contents($privateKeyPath, $privateKey));
            [$service] = $this->createService([], [
                'cdn' => [
                    'root' => 'https://cdn.example.test',
                    'provider' => 'ClOuDfRoNt',
                    'private_key' => $privateKeyPath,
                    'key_pair_id' => 'test-key-pair',
                ],
            ]);

            $uri = $service->getPreSignedUrl(
                'https://test-bucket.s3.us-east-1.amazonaws.com/assets/photo.jpg',
                '+5 minutes',
                ['Bucket' => 'test-bucket']
            );
            parse_str($uri->getQuery(), $query);

            self::assertSame('https://cdn.example.test/assets/photo.jpg', $uri->withQuery('')->__toString());
            self::assertSame('test-key-pair', $query['Key-Pair-Id']);
            self::assertArrayHasKey('Signature', $query);
            self::assertArrayHasKey('Expires', $query);
        } finally {
            unlink($privateKeyPath);
        }
    }

    #[Test]
    public function putObjectPassesArgumentsToTheClient(): void
    {
        $result = new Result(['ETag' => '"uploaded"']);
        [$service, $handler] = $this->createService([$result]);
        $args = ['Bucket' => 'test-bucket', 'Key' => 'file.txt', 'Body' => 'payload'];

        self::assertSame($result, $service->putObject($args));
        self::assertSame('PutObject', $handler->getLastCommand()->getName());
        self::assertSame($args, $this->commandArguments($handler));
    }

    #[Test]
    public function uploadFileUsesTheFileAsBodyAndClosesItsStream(): void
    {
        $file = tempnam(sys_get_temp_dir(), 's3-upload-');
        self::assertNotFalse($file);

        try {
            self::assertSame(7, file_put_contents($file, 'payload'));
            [$service, $handler] = $this->createService([new Result()]);

            $service->uploadFile($file, 'folder/upload.txt', ['Bucket' => 'test-bucket']);

            $command = $handler->getLastCommand();
            self::assertSame('PutObject', $command->getName());
            self::assertSame('folder/upload.txt', $command['Key']);
            self::assertSame('test-bucket', $command['Bucket']);
            self::assertTrue($command['Body']->eof());
        } finally {
            unlink($file);
        }
    }

    #[Test]
    public function uploadFileDataSetsKeyAndBody(): void
    {
        [$service, $handler] = $this->createService([new Result()]);

        $service->uploadFileData('payload', 'folder/upload.txt', ['Bucket' => 'test-bucket']);

        $command = $handler->getLastCommand();
        self::assertSame('PutObject', $command->getName());
        self::assertSame('folder/upload.txt', $command['Key']);
        self::assertSame('payload', $command['Body']);
    }

    #[Test]
    public function deleteObjectPassesArgumentsToTheClient(): void
    {
        $result = new Result();
        [$service, $handler] = $this->createService([$result]);
        $args = ['Bucket' => 'test-bucket', 'Key' => 'file.txt'];

        self::assertSame($result, $service->deleteObject($args));
        self::assertSame('DeleteObject', $handler->getLastCommand()->getName());
        self::assertSame($args, $this->commandArguments($handler));
    }

    #[Test]
    public function deleteFileStripsTheStorageHostAndPreservesOptions(): void
    {
        [$service, $handler] = $this->createService([new Result()]);

        $service->deleteFile(
            'https://test-bucket.s3.us-east-1.amazonaws.com/assets/file.txt',
            ['Bucket' => 'test-bucket']
        );

        self::assertSame(
            ['Bucket' => 'test-bucket', 'Key' => 'assets/file.txt'],
            $this->commandArguments($handler)
        );
    }

    #[Test]
    public function deleteByFullPathExtractsTheLegacyS3UrlKeyAndDefaultsTheBucket(): void
    {
        [$service, $handler] = $this->createService([new Result()]);

        $service->deleteByFullPath('https://s3.amazonaws.com/test-bucket/assets/file.txt');

        self::assertSame(
            ['Key' => 'assets/file.txt', 'Bucket' => 'test-bucket'],
            $this->commandArguments($handler)
        );
    }

    #[Test]
    public function listObjectsRemovesTheSubfolderAndAddsEachObjectUri(): void
    {
        [$service, $handler] = $this->createService([
            new Result([
                'Contents' => [
                    [
                        'Key' => 'assets/images/photo.jpg',
                        'Size' => 42,
                        'LastModified' => '2025-01-02T03:04:05Z',
                    ],
                ],
            ]),
        ], ['bucket' => 'test-bucket', 'subfolder' => 'assets']);

        $objects = iterator_to_array(
            $service->listObjects('assets/images/', ['Bucket' => 'test-bucket'])
        );

        self::assertSame('ListObjects', $handler->getLastCommand()->getName());
        self::assertSame('assets/images/', $handler->getLastCommand()['Prefix']);
        self::assertSame('/images/photo.jpg', $objects[0]['Key']);
        self::assertSame('https://test-bucket.s3.us-east-1.amazonaws.com/assets/images/photo.jpg', (string) $objects[0]['Uri']);
    }

    #[Test]
    public function existsChecksTheObjectInTheConfiguredBucket(): void
    {
        [$service, $handler] = $this->createService([new Result()]);

        self::assertTrue($service->exists('folder/file.txt', ['RequestPayer' => 'requester']));
        self::assertSame('HeadObject', $handler->getLastCommand()->getName());
        self::assertSame('test-bucket', $handler->getLastCommand()['Bucket']);
        self::assertSame('folder/file.txt', $handler->getLastCommand()['Key']);
        self::assertSame('requester', $handler->getLastCommand()['RequestPayer']);
    }

    #[Test]
    public function getPathFromFullUrlRecognizesStorageAndCdnHosts(): void
    {
        [$service] = $this->createService([], [
            'subfolder' => 'assets',
            'cdn' => [
                'root' => 'https://cdn.example.test',
                'provider' => 'cloudfront',
            ],
        ]);

        self::assertSame('file.txt', $service->getPathFromFullUrl(
            'https://test-bucket.s3.us-east-1.amazonaws.com/assets/file.txt'
        ));
        self::assertSame('file.txt', $service->getPathFromFullUrl(
            'https://s3.us-east-1.amazonaws.com/test-bucket/assets/file.txt'
        ));
        self::assertSame('assets/file.txt', $service->getPathFromFullUrl(
            'https://cdn.example.test/assets/file.txt'
        ));
        self::assertSame('folder/file.txt', $service->getPathFromFullUrl('folder/file.txt'));
        self::assertSame('https://unrelated.example.test/file.txt', $service->getPathFromFullUrl(
            'https://unrelated.example.test/file.txt'
        ));
    }

    #[Test]
    public function getBucketNameRequiresAConfiguredBucket(): void
    {
        [$service] = $this->createService([], ['bucket' => '']);

        $this->expectException(\UnexpectedValueException::class);
        $this->expectExceptionMessageIs('Please enter bucket first.');

        $service->getBucketName();
    }

    #[Test]
    public function getHostBuildsVirtualStyleAndAddsTheSubfolder(): void
    {
        [$service] = $this->createService([], ['subfolder' => 'assets']);

        self::assertSame(
            'https://test-bucket.s3.us-east-1.amazonaws.com/assets',
            (string) $service->getHost()
        );
    }

    #[Test]
    public function getHostUsesPathStyleForExplicitPathStyleAndDottedHttpsBuckets(): void
    {
        [$service] = $this->createService([], ['bucket' => 'my.bucket', 'subfolder' => 'assets']);

        self::assertSame(
            'https://s3.us-east-1.amazonaws.com/my.bucket/assets',
            (string) $service->getHost()
        );
        self::assertSame(
            'https://s3.us-east-1.amazonaws.com/my.bucket',
            (string) $service->getHost(false, true)
        );
    }

    #[Test]
    public function getViewerHostAndGetUriPreferTheConfiguredCdn(): void
    {
        [$service] = $this->createService([], [
            'cdn' => [
                'root' => 'https://cdn.example.test/base',
                'provider' => 'cloudfront',
            ],
        ]);

        self::assertSame('https://cdn.example.test/base', (string) $service->getViewerHost());
        self::assertSame('https://cdn.example.test/base/photo.jpg', (string) $service->getUri('/photo.jpg'));
        self::assertSame('cloudfront', $service->getCDNProvider());
    }

    #[Test]
    public function runCommandExecutesTheNamedAwsCommand(): void
    {
        $result = new Result(['ETag' => '"uploaded"']);
        [$service, $handler] = $this->createService([$result]);

        self::assertSame(
            $result,
            $service->runCommand('PutObject', [
                'Bucket' => 'test-bucket',
                'Key' => 'file.txt',
                'Body' => 'payload',
            ])
        );
        self::assertSame('PutObject', $handler->getLastCommand()->getName());
        self::assertSame('file.txt', $handler->getLastCommand()['Key']);
    }

    #[Test]
    public function accessorsReturnOptionsAndAllowReplacingTheClient(): void
    {
        [$service, , , $client] = $this->createService([], [
            'access_key' => 'access-key',
            'secret' => 'secret-key',
            'subfolder' => 'assets',
        ]);

        self::assertSame($client, $service->getClient());
        self::assertSame('access-key', $service->getKey());
        self::assertSame('secret-key', $service->getSecret());
        self::assertSame('test-bucket', $service->getBucketName());
        self::assertSame('assets', $service->getSubfolder());

        $replacement = $this->createS3Client(new MockHandler());

        self::assertSame($service, $service->setClient($replacement));
        self::assertSame($replacement, $service->getClient());
    }

    /**
     * @param  list<Result>  $responses
     *
     * @return  array{ S3Service, MockHandler, array, S3Client }
     */
    private function createService(
        array $responses = [],
        array $options = [],
        array $clientOptions = []
    ): array {
        $handler = new MockHandler($responses);
        $client = $this->createS3Client($handler, $clientOptions);
        $service = new S3Service($client, [
            'bucket' => 'test-bucket',
            ...$options,
        ]);

        return [$service, $handler, $options, $client];
    }

    private function createS3Client(MockHandler $handler, array $options = []): S3Client
    {
        return new S3Client([
            'credentials' => ['key' => 'test-key', 'secret' => 'test-secret'],
            'region' => 'us-east-1',
            'version' => 'latest',
            'handler' => $handler,
            'endpoint' => 'https://s3.us-east-1.amazonaws.com',
            ...$options,
        ]);
    }

    private function commandArguments(MockHandler $handler): array
    {
        $args = $handler->getLastCommand()->toArray();
        // Newer AWS SDK releases inject ChecksumMode into GetObject/HeadObject by default.
        unset($args['@http'], $args['@context'], $args['ChecksumMode']);

        return $args;
    }
}

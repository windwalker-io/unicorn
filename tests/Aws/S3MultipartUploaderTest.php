<?php

declare(strict_types=1);

namespace Unicorn\Tests\Aws;

use Aws\Command;
use Aws\Exception\AwsException;
use Aws\MockHandler;
use Aws\Result;
use Aws\S3\S3Client;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mime\MimeTypes;
use Unicorn\Aws\S3MultipartUploader;
use Unicorn\Aws\S3Service;
use Unicorn\Storage\Adapter\S3Storage;
use Unicorn\Storage\StorageInterface;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Http\Helper\HeaderHelper;

/**
 * Covers multipart upload request construction and lifecycle rule management
 * using the AWS SDK's in-memory handler; no AWS account or network is needed.
 */
final class S3MultipartUploaderTest extends TestCase
{
    #[Test]
    public function initCreatesMultipartUploadWithAllowedOptionsAndDefaultAcl(): void
    {
        [$uploader, $handler] = $this->createUploader([
            new Result(['UploadId' => 'upload-123']),
        ]);

        $uploadId = $uploader->init('media/archive.zip', ['ContentType' => 'application/zip']);

        self::assertSame('upload-123', $uploadId);
        $command = $handler->getLastCommand();
        self::assertSame('CreateMultipartUpload', $command->getName());
        self::assertSame('test-bucket', $command['Bucket']);
        self::assertSame('media/archive.zip', $command['Key']);
        self::assertSame('application/zip', $command['ContentType']);
        self::assertSame(S3MultipartUploader::ACL_AUTHENTICATED_READ, $command['ACL']);
    }

    #[Test]
    public function initRejectsExtraOptionsNotOnTheAllowList(): void
    {
        [$uploader, $handler] = $this->createUploader();

        try {
            $uploader->init('media/file.txt', ['CacheControl' => 'no-cache']);
            self::fail('Expected an invalid argument exception.');
        } catch (\InvalidArgumentException $exception) {
            self::assertSame('Extra args not allowed: CacheControl', $exception->getMessage());
        }

        self::assertCount(0, $handler);
    }

    #[Test]
    public function allowExtraEnablesAdditionalMultipartOptions(): void
    {
        [$uploader, $handler] = $this->createUploader([
            new Result(['UploadId' => 'upload-456']),
        ]);

        self::assertSame($uploader, $uploader->allowExtra('CacheControl'));
        self::assertSame('upload-456', $uploader->init('media/file.txt', ['CacheControl' => 'no-cache']));
        self::assertSame('no-cache', $handler->getLastCommand()['CacheControl']);
    }

    #[Test]
    public function initWithFilenameAddsAttachmentContentDisposition(): void
    {
        [$uploader, $handler] = $this->createUploader([
            new Result(['UploadId' => 'upload-789']),
        ]);
        $filename = 'quarterly report.pdf';

        $uploader->initWithFilename('reports/quarterly.pdf', $filename);

        self::assertSame(
            HeaderHelper::attachmentContentDisposition($filename),
            $handler->getLastCommand()['ContentDisposition']
        );
    }

    #[Test]
    public function signReturnsPresignedUploadPartRequest(): void
    {
        [$uploader] = $this->createUploader();
        $uploader->presignExpires = '+5 minutes';

        $request = $uploader->sign('upload-123', 'media/archive.zip', 4);
        parse_str($request->getUri()->getQuery(), $query);

        self::assertSame('upload-123', $query['uploadId']);
        self::assertSame('4', $query['partNumber']);
        self::assertSame('300', $query['X-Amz-Expires']);
    }

    #[Test]
    public function completeSubmitsAllPartsAndReturnsTheAwsResult(): void
    {
        $result = new Result(['Location' => 'https://example.test/media/archive.zip']);
        [$uploader, $handler] = $this->createUploader([$result]);
        $parts = [
            ['PartNumber' => 1, 'ETag' => '"part-one"'],
            ['PartNumber' => 2, 'ETag' => '"part-two"'],
        ];

        self::assertSame($result, $uploader->complete('upload-123', 'media/archive.zip', $parts));

        $command = $handler->getLastCommand();
        self::assertSame('CompleteMultipartUpload', $command->getName());
        self::assertSame('test-bucket', $command['Bucket']);
        self::assertSame('media/archive.zip', $command['Key']);
        self::assertSame('upload-123', $command['UploadId']);
        self::assertSame($parts, $command['MultipartUpload']['Parts']);
    }

    #[Test]
    public function abortSubmitsTheMultipartUploadIdentifiers(): void
    {
        $result = new Result();
        [$uploader, $handler] = $this->createUploader([$result]);

        self::assertSame($result, $uploader->abort('upload-123', 'media/archive.zip'));

        $command = $handler->getLastCommand();
        self::assertSame('AbortMultipartUpload', $command->getName());
        self::assertSame('test-bucket', $command['Bucket']);
        self::assertSame('media/archive.zip', $command['Key']);
        self::assertSame('upload-123', $command['UploadId']);
    }

    #[Test]
    public function updateExpiresRulesReplacesTheExistingAbortRule(): void
    {
        $keptRule = [
            'ID' => 'KeepRule',
            'Status' => 'Enabled',
            'Filter' => ['Prefix' => 'archive/'],
            'Expiration' => ['Days' => 30],
        ];
        $result = new Result();
        [$uploader, $handler] = $this->createUploader([
            new Result([
                'Rules' => [
                    $keptRule,
                    [
                        'ID' => 'AbortIncompleteMultipartUpload',
                        'Status' => 'Enabled',
                        'Filter' => [],
                        'AbortIncompleteMultipartUpload' => ['DaysAfterInitiation' => 2],
                    ],
                ],
            ]),
            $result,
        ]);
        $uploader->tempExpireDays = 5;

        self::assertSame($result, $uploader->updateExpiresRules());

        $command = $handler->getLastCommand();
        self::assertSame('PutBucketLifecycleConfiguration', $command->getName());
        self::assertSame('test-bucket', $command['Bucket']);
        self::assertSame(
            [
                $keptRule,
                [
                    'ID' => 'AbortIncompleteMultipartUpload',
                    'Status' => 'Enabled',
                    'Filter' => [],
                    'AbortIncompleteMultipartUpload' => ['DaysAfterInitiation' => 5],
                ],
            ],
            $command['LifecycleConfiguration']['Rules']
        );
    }

    #[Test]
    public function updateExpiresRulesCreatesRulesWhenNoLifecycleConfigurationExists(): void
    {
        $missingConfiguration = new AwsException(
            'Lifecycle configuration does not exist.',
            new Command('GetBucketLifecycleConfiguration'),
            ['code' => 'NoSuchLifecycleConfiguration']
        );
        [$uploader, $handler] = $this->createUploader([
            $missingConfiguration,
            new Result(),
        ]);

        $uploader->updateExpiresRules();

        $command = $handler->getLastCommand();
        self::assertSame('PutBucketLifecycleConfiguration', $command->getName());
        self::assertSame(
            [
                [
                    'ID' => 'AbortIncompleteMultipartUpload',
                    'Status' => 'Enabled',
                    'Filter' => [],
                    'AbortIncompleteMultipartUpload' => ['DaysAfterInitiation' => 7],
                ],
            ],
            $command['LifecycleConfiguration']['Rules']
        );
    }

    #[Test]
    public function updateExpiresRulesRemovesAbortRuleWhenExpiryIsDisabled(): void
    {
        [$uploader, $handler] = $this->createUploader([
            new Result([
                'Rules' => [
                    [
                        'ID' => 'AbortIncompleteMultipartUpload',
                        'Status' => 'Enabled',
                        'Filter' => [],
                        'AbortIncompleteMultipartUpload' => ['DaysAfterInitiation' => 2],
                    ],
                ],
            ]),
            new Result(),
        ]);
        $uploader->tempExpireDays = null;

        $uploader->updateExpiresRules();

        self::assertSame([], $handler->getLastCommand()['LifecycleConfiguration']['Rules']);
    }

    #[Test]
    public function initUpdatesExpiryRulesBeforeStartingUploadWhenEnabled(): void
    {
        [$uploader, $handler] = $this->createUploader([
            new Result(['Rules' => []]),
            new Result(),
            new Result(['UploadId' => 'upload-auto-expiry']),
        ]);
        $uploader->autoUpdateExpires = true;

        self::assertSame('upload-auto-expiry', $uploader->init('media/file.txt'));
        self::assertSame('CreateMultipartUpload', $handler->getLastCommand()->getName());
    }

    #[Test]
    public function getS3ServiceUsesTheConfiguredOrExplicitProfileTag(): void
    {
        [, , $storage, $service, $client] = $this->createUploader();
        $app = $this->createMock(ApplicationInterface::class);
        $receivedTags = [];
        $app->expects($this->exactly(2))
            ->method('retrieve')
            ->with(StorageInterface::class, false, $this->anything())
            ->willReturnCallback(static function (string $id, bool $forceNew, ?string $tag) use (
                $storage,
                &$receivedTags
            ): S3Storage {
                $receivedTags[] = $tag;

                return $storage;
            });
        $uploader = new S3MultipartUploader($app);
        $uploader->profile = 'configured-profile';

        self::assertSame([$service, $client], $uploader->getS3Service());
        self::assertSame([$service, $client], $uploader->getS3Service('explicit-profile'));
        self::assertSame(['configured-profile', 'explicit-profile'], $receivedTags);
    }

    #[Test]
    public function getS3ServiceRejectsAStorageThatIsNotS3Storage(): void
    {
        $app = $this->createStub(ApplicationInterface::class);
        $app->method('retrieve')->willReturn(new \stdClass());
        $uploader = new S3MultipartUploader($app);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageIs('Storage must be instance of S3Storage');

        $uploader->getS3Service();
    }

    /**
     * @param  list<Result|AwsException>  $responses
     *
     * @return  array{ S3MultipartUploader, MockHandler, S3Storage, S3Service, S3Client }
     */
    private function createUploader(array $responses = []): array
    {
        $handler = new MockHandler($responses);
        $client = new S3Client([
            'credentials' => ['key' => 'test-key', 'secret' => 'test-secret'],
            'region' => 'us-east-1',
            'version' => 'latest',
            'handler' => $handler,
        ]);
        $service = new S3Service($client, ['bucket' => 'test-bucket']);
        $storage = new S3Storage($service, new MimeTypes());
        $app = $this->createStub(ApplicationInterface::class);
        $app->method('retrieve')->willReturn($storage);

        return [new S3MultipartUploader($app), $handler, $storage, $service, $client];
    }
}

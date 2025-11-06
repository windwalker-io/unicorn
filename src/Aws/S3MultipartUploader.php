<?php

declare(strict_types=1);

namespace Unicorn\Aws;

use Aws\Exception\AwsException;
use Aws\Result;
use Aws\S3\S3Client;
use Psr\Http\Message\RequestInterface;
use Unicorn\Storage\Adapter\S3Storage;
use Unicorn\Storage\StorageInterface;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Http\Helper\HeaderHelper;
use Windwalker\Utilities\Arr;

class S3MultipartUploader
{
    use S3ConstantTrait;

    public array $allowedExtra = [
        'ContentDisposition',
        'ContentType',
    ];

    public ?string $profile = null;

    public string $acl = self::ACL_AUTHENTICATED_READ;

    public int|string|\DateTimeInterface $presignExpires = '+10 minutes';

    public bool $autoUpdateExpires = true;

    public ?int $tempExpireDays = 7;

    public function __construct(protected ApplicationInterface $app)
    {
    }

    public function init(string $path, array $extra = [], ?string $profile = null): string
    {
        if ($this->autoUpdateExpires) {
            $this->updateExpiresRules($profile);
        }

        [$s3Service, $s3Client] = $this->getS3Service($profile);

        $except = (array) Arr::except($extra, $this->allowedExtra);

        if ($except !== []) {
            throw new \InvalidArgumentException(
                'Extra args not allowed: ' . implode(', ', array_keys($except))
            );
        }

        if ($this->acl && empty($extra['ACL'])) {
            $extra['ACL'] = $this->acl;
        }

        $result = $s3Client->createMultipartUpload(
            [
                'Bucket' => $s3Service->getBucketName(),
                'Key' => $path,
                ...$extra,
            ]
        );

        return $result['UploadId'];
    }

    public function initWithFilename(
        string $path,
        ?string $filename,
        array $extra = [],
        ?string $profile = null
    ): string {
        if ($filename) {
            $extra['ContentDisposition'] = HeaderHelper::attachmentContentDisposition($filename);
        }

        return $this->init($path, $extra, $profile);
    }

    public function sign(string $id, string $path, int $partNumber, ?string $profile = null): RequestInterface
    {
        [$s3Service, $s3Client] = $this->getS3Service($profile);

        $cmd = $s3Client->getCommand('UploadPart', [
            'Bucket' => $s3Service->getBucketName(),
            'Key' => $path,
            'UploadId' => $id,
            'PartNumber' => $partNumber,
        ]);

        return $s3Client->createPresignedRequest($cmd, $this->presignExpires);
    }

    public function complete(string $id, string $path, array $parts, ?string $profile = null): Result
    {
        [$s3Service, $s3Client] = $this->getS3Service($profile);

        return $s3Client->completeMultipartUpload([
            'Bucket' => $s3Service->getBucketName(),
            'Key' => $path,
            'UploadId' => $id,
            'MultipartUpload' => [
                'Parts' => $parts,
            ],
        ]);
    }

    public function abort(string $id, string $path, ?string $profile = null): Result
    {
        [$s3Service, $s3Client] = $this->getS3Service($profile);

        return $s3Client->abortMultipartUpload([
            'Bucket' => $s3Service->getBucketName(),
            'Key' => $path,
            'UploadId' => $id,
        ]);
    }

    public function updateExpiresRules(?string $profile = null): Result
    {
        [$s3Service, $s3Client] = $this->getS3Service($profile);

        try {
            $result = $s3Client->getBucketLifecycleConfiguration([
                'Bucket' => $s3Service->getBucketName(),
            ]);
            $rules = $result['Rules'];
        } catch (AwsException $e) {
            // If no lifecycle, create new rules
            $rules = [];
        }

        $rules = array_filter($rules, fn ($rule) => $rule['ID'] !== 'AbortIncompleteMultipartUpload');

        if ($this->tempExpireDays) {
            $rules[] = [
                'ID' => 'AbortIncompleteMultipartUpload',
                'Status' => 'Enabled',
                'Filter' => [],
                'AbortIncompleteMultipartUpload' => [
                    'DaysAfterInitiation' => $this->tempExpireDays,
                ],
            ];
        }

        return $s3Client->putBucketLifecycleConfiguration(
            [
                'Bucket' => $s3Service->getBucketName(),
                'LifecycleConfiguration' => ['Rules' => array_values($rules)],
            ]
        );
    }

    /**
     * @param  string|null  $profile
     *
     * @return  array{ S3Service, S3Client }
     */
    public function getS3Service(?string $profile = null): array
    {
        $profile ??= $this->profile;

        $storage = $this->app->retrieve(StorageInterface::class, tag: $profile);

        if (!$storage instanceof S3Storage) {
            throw new \RuntimeException('Storage must be instance of S3Storage');
        }

        $s3Service = $storage->getS3Service();
        $s3Client = $s3Service->getClient();

        return [$s3Service, $s3Client];
    }

    public function allowExtra(string ...$args): static
    {
        $this->allowedExtra = [...$this->allowedExtra, ...$args];

        return $this;
    }
}

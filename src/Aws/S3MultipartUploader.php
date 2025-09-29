<?php

declare(strict_types=1);

namespace Unicorn\Aws;

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

    public protected(set) array $allowedExtra = [
        'ContentDisposition',
        'ContentType',
    ];

    public protected(set) ?string $profile = null;

    public protected(set) string $acl = self::ACL_AUTHENTICATED_READ;

    public protected(set) int|string|\DateTimeInterface $presignExpires = '+10 minutes';

    public function __construct(protected ApplicationInterface $app)
    {
    }

    public function init(string $path, array $extra = [], ?string $profile = null): string
    {
        [$s3Service, $s3Client] = $this->getS3Service($profile);

        $extra = (array) Arr::only($extra, $this->allowedExtra);

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

    public function clearAllowExtra(): static
    {
        $this->allowedExtra = [];

        return $this;
    }

    public function getAcl(): string
    {
        return $this->acl;
    }

    public function useACL(string $acl): static
    {
        $this->acl = $acl;

        return $this;
    }

    public function getProfile(): ?string
    {
        return $this->profile;
    }

    public function useProfile(?string $profile): static
    {
        $this->profile = $profile;

        return $this;
    }

    public function getPresignExpires(): \DateTimeInterface|int|string
    {
        return $this->presignExpires;
    }

    public function presignExpires(\DateTimeInterface|int|string $presignExpires): static
    {
        $this->presignExpires = $presignExpires;

        return $this;
    }
}

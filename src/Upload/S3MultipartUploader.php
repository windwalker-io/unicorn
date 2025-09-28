<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Aws\Result;
use Aws\S3\S3Client;
use Psr\Http\Message\RequestInterface;
use Unicorn\Aws\S3Service;
use Unicorn\Storage\Adapter\S3Storage;
use Unicorn\Storage\StorageInterface;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Http\Helper\HeaderHelper;

class S3MultipartUploader
{
    public function __construct(protected ApplicationInterface $app)
    {
    }

    public function init(string $path, ?string $filename, array $extra = [], ?string $profile = null): string
    {
        [$s3Service, $s3Client] = $this->getS3Service($profile);

        if ($filename) {
            $extra['ContentDisposition'] = HeaderHelper::attachmentContentDisposition($filename);
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

    public function sign(string $id, string $path, int $partNumber, ?string $profile = null): RequestInterface
    {
        [$s3Service, $s3Client] = $this->getS3Service($profile);

        $cmd = $s3Client->getCommand('UploadPart', [
            'Bucket'     => $s3Service->getBucketName(),
            'Key'        => $path,
            'UploadId'   => $id,
            'PartNumber' => $partNumber,
        ]);

        return $s3Client->createPresignedRequest($cmd, '+10 minutes');
    }

    public function complete(string $id, string $path, array $parts, ?string $profile = null): Result
    {
        [$s3Service, $s3Client] = $this->getS3Service($profile);

        return $s3Client->completeMultipartUpload([
            'Bucket'   => $s3Service->getBucketName(),
            'Key'      => $path,
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
            'Bucket'   => $s3Service->getBucketName(),
            'Key'      => $path,
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
        $storage = $this->app->retrieve(StorageInterface::class, tag: $profile);

        if (!$storage instanceof S3Storage) {
            throw new \RuntimeException('Storage must be instance of S3Storage');
        }

        $s3Service = $storage->getS3Service();
        $s3Client = $s3Service->getClient();

        return [$s3Service, $s3Client];
    }
}

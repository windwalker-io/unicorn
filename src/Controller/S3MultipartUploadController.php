<?php

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Aws\S3MultipartUploadControllerTrait;
use Unicorn\Aws\S3MultipartUploader;
use Windwalker\Core\Attributes\Controller;

#[Controller]
class S3MultipartUploadController
{
    use S3MultipartUploadControllerTrait;

    protected static function configureUploader(S3MultipartUploader $uploader): void
    {
    }
}

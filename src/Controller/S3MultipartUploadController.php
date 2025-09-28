<?php

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Upload\S3MultipartUploadControllerTrait;
use Windwalker\Core\Attributes\Controller;

#[Controller]
class S3MultipartUploadController
{
    use S3MultipartUploadControllerTrait;
}

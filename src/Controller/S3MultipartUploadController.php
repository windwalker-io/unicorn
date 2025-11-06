<?php

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Aws\S3MultipartUploadControllerTrait;
use Unicorn\Aws\S3MultipartUploader;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Http\AppRequest;

#[Controller]
class S3MultipartUploadController
{
    use S3MultipartUploadControllerTrait;

    protected function configureUploader(S3MultipartUploader $uploader): void
    {
        if ($this->app->hasService(AppRequest::class)) {
            $appRequest = $this->app->retrieve(AppRequest::class);
            $route = $appRequest->getMatchedRoute();
            $callback = $route?->getExtraValue('configureUploader');

            if ($callback instanceof \Closure) {
                $callback($uploader);
            }
        }
    }
}

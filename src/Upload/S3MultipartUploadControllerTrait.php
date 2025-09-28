<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Windwalker\Core\Attributes\Request\Input;

trait S3MultipartUploadControllerTrait
{
    use AjaxControllerTrait;

    #[Ajax]
    public function init(
        S3MultipartUploader $uploader,
        #[Input] string $path,
        #[Input] ?string $filename = null,
        #[Input] array $extra = [],
        #[Input] ?string $profile = null,
    ): array {
        $id = $uploader->init($path, $filename, $extra, $profile);

        return [
            'id' => $id,
        ];
    }

    #[Ajax]
    public function sign(
        S3MultipartUploader $uploader,
        #[Input] string $id,
        #[Input] string $path,
        #[Input] int $partNumber,
        #[Input] ?string $profile = null,
    ): array {
        try {
            $request = $uploader->sign($id, $path, $partNumber, $profile);

            return [
                'url' => (string) $request->getUri(),
            ];
        } catch (\Throwable $e) {
            $this->abort($uploader, $id, $path, $profile);

            throw $e;
        }
    }

    #[Ajax]
    public function complete(
        S3MultipartUploader $uploader,
        #[Input] string $id,
        #[Input] string $path,
        #[Input] array $parts,
        #[Input] ?string $profile = null,
    ): array {
        try {
            $result = $uploader->complete($id, $path, $parts, $profile);

            return [
                'url' => $result['Location'],
            ];
        } catch (\Throwable $e) {
            $this->abort($uploader, $id, $path, $profile);

            throw $e;
        }
    }

    #[Ajax]
    public function abort(
        S3MultipartUploader $uploader,
        #[Input] string $id,
        #[Input] string $path,
        #[Input] ?string $profile = null,
    ): true {
        $uploader->abort($id, $path, $profile);

        return true;
    }
}

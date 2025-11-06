<?php

declare(strict_types=1);

namespace Unicorn\Aws;

use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\DI\Attributes\Inject;

trait S3MultipartUploadControllerTrait
{
    use AjaxControllerTrait;

    #[Inject]
    protected ApplicationInterface $app;

    protected S3MultipartUploader $uploader;

    protected function getS3MultipartUploader(): S3MultipartUploader
    {
        if (isset($this->uploader)) {
            return $this->uploader;
        }

        $uploader = new S3MultipartUploader($this->app);

        $this->configureUploader($uploader);

        return $uploader;
    }

    abstract protected function configureUploader(S3MultipartUploader $uploader): void;

    #[Ajax]
    public function init(
        #[Input] string $path,
        #[Input] ?string $filename = null,
        #[Input] array $extra = [],
        #[Input] ?string $profile = null,
    ): array {
        $id = $this->getS3MultipartUploader()->initWithFilename($path, $filename, $extra, $profile);

        return [
            'id' => $id,
        ];
    }

    #[Ajax]
    public function sign(
        #[Input] string $id,
        #[Input] string $path,
        #[Input] int $partNumber,
        #[Input] ?string $profile = null,
    ): array {
        try {
            $request = $this->getS3MultipartUploader()->sign($id, $path, $partNumber, $profile);

            return [
                'url' => (string) $request->getUri(),
            ];
        } catch (\Throwable $e) {
            $this->abort($id, $path, $profile);

            throw $e;
        }
    }

    #[Ajax]
    public function complete(
        #[Input] string $id,
        #[Input] string $path,
        #[Input] array $parts,
        #[Input] ?string $profile = null,
    ): array {
        try {
            $result = $this->getS3MultipartUploader()->complete($id, $path, $parts, $profile);

            return [
                'url' => $result['Location'],
            ];
        } catch (\Throwable $e) {
            $this->abort($id, $path, $profile);

            throw $e;
        }
    }

    #[Ajax]
    public function abort(
        #[Input] string $id,
        #[Input] string $path,
        #[Input] ?string $profile = null,
    ): true {
        $this->getS3MultipartUploader()->abort($id, $path, $profile);

        return true;
    }
}

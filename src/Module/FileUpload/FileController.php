<?php

declare(strict_types=1);

namespace Unicorn\Module\FileUpload;

use Unicorn\Flysystem\Base64DataUri;
use Unicorn\Upload\FileUploadService;
use Unicorn\Upload\ResizeConfig;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Http\AppRequest;
use Windwalker\Http\Helper\UploadedFileHelper;

/**
 * The FileUploadController class.
 */
#[Controller]
class FileController
{
    public function upload(AppRequest $request, AppContext $app): array
    {
        [$dir, $path, $resize, $profile] = $request->input('dir', 'path', 'resize', 'profile')
            ->values()
            ->dump();

        $uploadService = $app->retrieve(FileUploadService::class, tag: $profile);

        if (!$uploadService) {
            throw new \DomainException('Unable to find profile: ' . get_debug_type($profile), 400);
        }

        if ((string) $resize === '1') {
            $size = $request->input('size');
            [$width, $height] = explode('x', (string) $size) + [null, null];
            $width = (int) ($request->input('width') ?: $width);
            $height = (int) ($request->input('height') ?: $height);

            $uploadService->setResizeConfig(
                new ResizeConfig(
                    enabled: true,
                    width: $width ?: null,
                    height: $height ?: null,
                    quality: ((int) $request->input('quality')) ?: null,
                    crop: (bool) $request->input('crop'),
                    outputFormat: $request->input('output_format') ?: null,
                    orientate: (bool) $request->input('orientate'),
                )
            );
        } elseif ($resize === '0') {
            $uploadService->options->resize->enabled = false;
        }

        if ($dir) {
            $uploadService->options->dir = $dir;
        }

        $data = $request->input('data');
        $file = $request->file('file');

        if ($data !== null) {
            if (!Base64DataUri::isDataUri((string) $data)) {
                throw new \RuntimeException('Invalid file data', 400);
            }

            $result = $uploadService->handleBase64($data, $path);
        } else {
            if (!$file || $file->getError()) {
                $msg = 'Upload fail';

                if ($app->isDebug() && $file) {
                    $msg .= ': ' . UploadedFileHelper::getUploadMessage($file->getError());
                }

                throw new \RuntimeException($msg, 400);
            }

            $result = $uploadService->handleFile($file, $path);
        }

        return [
            'url' => (string) $result->getUri(),
        ];
    }
}

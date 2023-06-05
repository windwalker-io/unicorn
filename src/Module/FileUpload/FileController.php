<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Module\FileUpload;

use Unicorn\Flysystem\Base64DataUri;
use Unicorn\Upload\FileUploadManager;
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
    public function upload(FileUploadManager $fileUploadManager, AppRequest $request, AppContext $app): array
    {
        [$dir, $path, $resize, $profile] = $request->input('dir', 'path', 'resize', 'profile')
            ->values()
            ->dump();

        $uploadService = $fileUploadManager->get($profile);

        if (!$uploadService) {
            throw new \DomainException('Unable to find profile: ' . get_debug_type($profile), 400);
        }

        if ((string) $resize === '1') {
            $size = $request->input('size');
            [$width, $height] = explode('x', (string) $size) + [null, null];
            $width = $request->input('width') ?: $width;
            $height = $request->input('height') ?: $height;

            $uploadService->setResizeConfig(
                [
                    'enabled' => (bool) $resize,
                    'width' => $width,
                    'height' => $height,
                    'crop' => $request->input('crop'),
                    'quality' => $request->input('quality'),
                    'output_format' => $request->input('output_format'),
                    'orientate' => $request->input('orientate'),
                ]
            );
        } elseif ($resize === '0') {
            $uploadService->setResizeConfig(
                [
                    'enabled' => false,
                ]
            );
        }

        if ($dir) {
            $uploadService->setOption('dir', $dir);
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

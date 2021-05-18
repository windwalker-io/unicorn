<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Module\FileUpload;

use Unicorn\Upload\FileUploadManager;
use Unicorn\Upload\FileUploadService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Json;
use Windwalker\Core\Attributes\TaskMapping;
use Windwalker\Core\Http\AppRequest;
use Windwalker\Http\Helper\UploadedFileHelper;

/**
 * The FileUploadController class.
 */
#[Controller]
#[TaskMapping(
    methods: [
        '*' => 'handle',
    ]
)]
class FileUploadController
{
    public function handle(FileUploadManager $fileUploadManager, AppRequest $request, AppContext $app)
    {
        [$dir, $path, $resize, $format, $profile] = $request->input(
            'dir',
            'path',
            'resize',
            'format',
            'profile'
        )
            ->values()
            ->dump();

        $file = $request->file('file');

        if (!$file || $file->getError()) {
            $msg = 'Upload fail';

            if ($app->isDebug()) {
                $msg .= ': ' . UploadedFileHelper::getUploadMessage($file->getError());
            }

            throw new \RuntimeException($msg, 400);
        }

        $uploadService = $fileUploadManager->get($profile);

        if (!$uploadService) {
            throw new \DomainException('Unable to find profile: ' . get_debug_type($profile), 400);
        }

        if ($dir) {
            $uploadService->setOption('dir', $dir);
        }

        $result = $uploadService->handleFile($file, $path);

        return [
            'url' => (string) $result->getUri()
        ];
    }
}

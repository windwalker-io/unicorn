<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Module\FileUpload;

use Unicorn\Upload\FileUploadService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
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
    public function handle(FileUploadService $fileUploadService, AppRequest $request, AppContext $app)
    {
        [$folder, $path, $resize, $format] = $request->input(
            'folder',
            'path',
            'resize',
            'format'
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

        $fileUploadService->handleFile($file);
    }
}

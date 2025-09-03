<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Windwalker\DI\Attributes\Isolation;

/**
 * The FileUploadManager class.
 *
 * @method FileUploadService get(?string $name = null, ...$args)
 *
 * @deprecated  Use container tags instead.
 */
#[Isolation]
class FileUploadManager extends FileUploadFactory
{
    //
}

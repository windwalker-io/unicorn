<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Windwalker\Core\Manager\AbstractManager;
use Windwalker\DI\Attributes\Isolation;

/**
 * The FileUploadManager class.
 *
 * @method FileUploadService get(?string $name = null, ...$args)
 */
#[Isolation]
class FileUploadManager extends AbstractManager
{
    public function getConfigPrefix(): string
    {
        return 'unicorn.file_upload';
    }

    /**
     * create
     *
     * @param  string|null  $name
     * @param  mixed        ...$args
     *
     * @return  FileUploadService
     */
    public function create(?string $name = null, ...$args): object
    {
        $name ??= $this->getDefaultName();

        if ($name === null) {
            throw new \InvalidArgumentException('Empty definition name.');
        }

        $options = $this->config->getDeep('profiles.' . $name);

        return $this->container->newInstance(
            FileUploadService::class,
            [
                'options' => $options
            ]
        );
    }
}

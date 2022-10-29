<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Upload;

use Windwalker\Core\Manager\AbstractManager;

/**
 * The FileUploadManager class.
 *
 * @method FileUploadService get(?string $name = null, ...$args)
 */
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

        if (!interface_exists(MimeTypesInterface::class)) {
            throw new \DomainException('Please install symfony/mime to support file upload.');
        }

        return $this->container->newInstance(
            FileUploadService::class,
            [
                'options' => $options
            ]
        );
    }
}

<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Upload;

use Windwalker\Core\Manager\AbstractManager;

/**
 * The FileUploadManager class.
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
     * @return  object
     */
    public function create(?string $name = null, ...$args): object
    {
        $name ??= $this->getDefaultName();

        if ($name === null) {
            throw new \InvalidArgumentException('Empty definition name.');
        }

        $options = $this->config->getDeep($name);

        return $this->container->newInstance(
            FileUploadService::class,
            [
                'options' => $options
            ]
        );
    }
}

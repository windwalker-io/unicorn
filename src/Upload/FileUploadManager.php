<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Windwalker\Core\Manager\AbstractManager;
use Windwalker\DI\Attributes\Isolation;
use Windwalker\DI\Exception\DefinitionResolveException;

/**
 * The FileUploadManager class.
 *
 * @method FileUploadService get(?string $name = null, ...$args)
 *
 * @deprecated  Use container tags instead.
 */
#[Isolation]
class FileUploadManager extends AbstractManager
{
    public function getConfigPrefix(): string
    {
        return 'unicorn.file_upload';
    }

    /**
     * @param  string|null  $name
     * @param  mixed        ...$args
     *
     * @return  FileUploadService
     * @throws \ReflectionException
     * @throws DefinitionResolveException
     */
    public function create(?string $name = null, ...$args): object
    {
        $name ??= $this->getDefaultName();

        if ($name === null) {
            throw new \InvalidArgumentException('Empty definition name.');
        }

        $options = $this->config->getDeep('profiles.' . $name);

        if (!$options) {
            throw new \InvalidArgumentException(
                sprintf('FileUploadService profile "%s" not found.', $name)
            );
        }

        return $this->container->newInstance(
            FileUploadService::class,
            [
                'options' => $options
            ]
        );
    }
}

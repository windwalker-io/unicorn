<?php

declare(strict_types=1);

namespace Unicorn\Upload;

use Unicorn\Upload\FileUploadService;
use Windwalker\Core\DI\ServiceFactoryInterface;
use Windwalker\Core\DI\ServiceFactoryTrait;
use Windwalker\DI\Attributes\Isolation;
use Windwalker\DI\Exception\DefinitionResolveException;

#[Isolation]
class FileUploadFactory implements ServiceFactoryInterface
{
    use ServiceFactoryTrait;

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

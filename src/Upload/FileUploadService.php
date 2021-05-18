<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Upload;

use Psr\Http\Message\UploadedFileInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Unicorn\Storage\StorageInterface;
use Unicorn\Storage\StorageManager;
use Windwalker\Core\Attributes\Ref;

use Windwalker\Utilities\Options\OptionsResolverTrait;

use function Windwalker\uid;

/**
 * The FileUploadService class.
 */
class FileUploadService
{
    use OptionsResolverTrait;

    /**
     * FileUploadService constructor.
     */
    public function __construct(array $options, protected StorageManager $storageManager)
    {
        $this->resolveOptions(
            $options,
            [$this, 'configureOptions']
        );
    }

    protected function configureOptions(OptionsResolver $resolver): void
    {
        //
    }

    public function getStorage(): StorageInterface
    {
        return $this->storageManager->get($this->options['storage']);
    }

    public function handleFile(UploadedFileInterface $file, ?string $dest = null)
    {
        $storage = $this->getStorage();

        $stream = $file->getStream();
        
    }

    /**
     * generateFileName
     *
     * @param  string  $prefix
     *
     * @return  string
     *
     * @throws \Exception
     */
    public function generateFileName(string $prefix = ''): string
    {
        return uid($prefix);
    }

    /**
     * getRealExtension
     *
     * @param   string $ext
     *
     * @return  string
     */
    public static function normalizeExtension(string $ext): string
    {
        $ext = strtolower($ext);

        if ($ext === 'jpeg') {
            $ext = 'jpg';
        }

        return $ext;
    }
}

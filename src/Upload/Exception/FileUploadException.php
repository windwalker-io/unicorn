<?php

/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2022 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Upload\Exception;

use Psr\Http\Message\UploadedFileInterface;

/**
 * The FileUploadException class.
 */
class FileUploadException extends \RuntimeException
{
    /**
     * @inheritDoc
     */
    public function __construct(
        string $message = '',
        int $code = 0,
        protected ?UploadedFileInterface $uploadedFile = null,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }

    /**
     * @return UploadedFileInterface|null
     */
    public function getUploadedFile(): ?UploadedFileInterface
    {
        return $this->uploadedFile;
    }

    public function getUploadError(): ?int
    {
        return $this->getUploadedFile()?->getError();
    }
}

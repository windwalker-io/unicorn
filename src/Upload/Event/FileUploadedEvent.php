<?php

declare(strict_types=1);

namespace Unicorn\Upload\Event;

use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UploadedFileInterface;
use Unicorn\Storage\PutResult;
use Unicorn\Upload\FileUploadOptions;
use Windwalker\Event\BaseEvent;
use Windwalker\Utilities\Accessible\AccessorBCTrait;

/**
 * The FileUploadedEvent class.
 */
class FileUploadedEvent extends BaseEvent
{
    use AccessorBCTrait;

    public function __construct(
        /**
         * @var UploadedFileInterface|string
         */
        public mixed $file,
        public PutResult $result,
        public StreamInterface $stream,
        public FileUploadOptions $options,
        public string $dest = '',
    ) {
    }
}

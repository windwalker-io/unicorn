<?php

/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Upload;

use Unicorn\Upload\Event\FileUploadedEvent;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Event\Attributes\EventSubscriber;
use Windwalker\Event\Attributes\ListenTo;
use Windwalker\Uri\Uri;
use Windwalker\Utilities\Str;

/**
 * The FileUploadSubscriber class.
 */
#[EventSubscriber]
class FileUploadSubscriber
{
    public function __construct(protected SystemUri $systemUri)
    {
    }

    #[ListenTo(FileUploadedEvent::class)]
    public function fileUploaded(FileUploadedEvent $event): void
    {
        $result = $event->getResult();

        $uri = (string) $result->getUri();

        $root = $this->systemUri->root;

        if (str_starts_with($uri, $root)) {
            $uri = ltrim(Str::removeLeft($uri, $root), '/');
        }

        $result->setUri(new Uri($uri));
    }
}

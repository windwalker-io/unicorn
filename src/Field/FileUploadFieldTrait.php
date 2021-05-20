<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\DI\Attributes\Inject;

/**
 * Trait FileUploadFieldTrait
 */
trait FileUploadFieldTrait
{
    #[Inject]
    protected Navigator $nav;

    public function getBuiltInUploadUrl(string $profile): RouteUri
    {
        return $this->nav->to('file_upload')->var('profile', $profile);
    }
}

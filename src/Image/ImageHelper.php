<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Image;

use Windwalker\Core\Asset\AssetService;

/**
 * The ImageHelper class.
 */
class ImageHelper
{
    /**
     * ImageService constructor.
     */
    public function __construct(protected AssetService $asset)
    {
    }

    public function placeholder(): string
    {
        return $this->asset->handleUri('@unicorn/images/default-img.png');
    }

    public function ajaxLoader(): string
    {
        return $this->asset->handleUri('@unicorn/images/ajax-loader.gif');
    }
}

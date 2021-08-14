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
use Windwalker\Utilities\Exception\ExceptionFactory;
use Windwalker\Utilities\Str;

/**
 * The ImageHelper class.
 *
 * @method string placeholderSquare()
 * @method string placeholder4to3()
 * @method string placeholder16to10()
 * @method string placeholder16to9()
 */
class ImagePlaceholder
{
    /**
     * ImageService constructor.
     */
    public function __construct(protected AssetService $asset)
    {
    }

    public function placeholder(string $ratio = '4:3'): string
    {
        $ratio = str_replace(':', '-', $ratio);

        return $this->asset->handleUri("@unicorn/../images/placeholder/image-$ratio.png");
    }

    public function avatar(): string
    {
        return $this->asset->handleUri("@unicorn/../images/placeholder/avatar.png");
    }

    public function ajaxLoader(): string
    {
        return $this->asset->handleUri('@unicorn/images/ajax-loader.gif');
    }

    public function __call(string $name, array $args): string
    {
        if (str_starts_with($name, 'placeholder')) {
            $ratio = strtolower(Str::removeLeft($name, 'placeholder'));

            return match ($ratio) {
                'square' => $this->placeholder('1:1'),
                '4to3' => $this->placeholder('4:3'),
                '16to10' => $this->placeholder('16:10'),
                '16to9' => $this->placeholder('16:9'),
            };
        }

        ExceptionFactory::badMethodCall($name);
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Image;

use Windwalker\Core\Asset\AssetService;
use Windwalker\Utilities\Exception\ExceptionFactory;
use Windwalker\Utilities\Str;

/**
 * The ImageHelper class.
 *
 * @method string placeholderSquare()
 * @method string placeholder4x3()
 * @method string placeholder16x10()
 * @method string placeholder16x9()
 */
class ImagePlaceholder
{
    protected array $imageMap = [];

    /**
     * ImageService constructor.
     */
    public function __construct(protected AssetService $asset)
    {
    }

    public function setImage(string $ratio, ?string $uri): void
    {
        $ratio = static::normalizeRatio($ratio);

        if ($uri === null) {
            unset($this->imageMap[$uri]);
            return;
        }

        $this->imageMap[$ratio] = $uri;
    }

    public function placeholder(string $ratio = '4:3'): string
    {
        $ratio = static::normalizeRatio($ratio);

        if ($this->imageMap[$ratio] ?? null) {
            return $this->asset->handleUri($this->imageMap[$ratio]);
        }

        return $this->asset->handleUri("@unicorn/../images/placeholder/image-$ratio.png", 'root');
    }

    public function avatar(): string
    {
        return $this->asset->handleUri("@unicorn/../images/placeholder/avatar.png", 'root');
    }

    public function ajaxLoader(): string
    {
        return $this->asset->handleUri('@unicorn/images/ajax-loader.gif', 'root');
    }

    public function __call(string $name, array $args): string
    {
        if (str_starts_with($name, 'placeholder')) {
            $ratio = strtolower(Str::removeLeft($name, 'placeholder'));

            return match ($ratio) {
                'square' => $this->placeholder('1:1'),
                '4x3', '4to3' => $this->placeholder('4:3'),
                '16x10', '16to10' => $this->placeholder('16:10'),
                '16x9', '16to9' => $this->placeholder('16:9'),
            };
        }

        throw ExceptionFactory::badMethodCall($name);
    }

    /**
     * @param  string  $ratio
     *
     * @return  string
     */
    public static function normalizeRatio(string $ratio): string
    {
        return str_replace(':', 'x', $ratio);
    }

    /**
     * @return array
     */
    public function getImageMap(): array
    {
        return $this->imageMap;
    }

    /**
     * @param  array  $imageMap
     *
     * @return  static  Return self to support chaining.
     */
    public function setImageMap(array $imageMap): static
    {
        $this->imageMap = $imageMap;

        return $this;
    }
}

<?php

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

    protected ?string $uploadProfile = null;

    public function getBuiltInUploadUrl(string $profile): RouteUri
    {
        return $this->nav->to('file_upload')->var('profile', $profile);
    }

    /**
     * @return string|null
     */
    public function getUploadProfile(): ?string
    {
        return $this->uploadProfile;
    }

    /**
     * @param  string|null  $uploadProfile
     *
     * @return  static  Return self to support chaining.
     */
    public function uploadProfile(?string $uploadProfile): static
    {
        $this->uploadProfile = $uploadProfile;

        return $this;
    }
}

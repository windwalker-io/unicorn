<?php

declare(strict_types=1);

namespace Unicorn\Enum;

use Windwalker\Utilities\Contract\LanguageInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;

/**
 * The State class.
 *
 * @method static static ARCHIVED()
 * @method static static TRASHED()
 */
enum PublishingState: int
{
    use EnumTranslatableTrait;

    case PUBLISHED = 1;
    case UNPUBLISHED = 0;
    case TRASHED = -2;
    case ARCHIVED = -1;

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('unicorn.state.' . $this->getKey());
    }

    public function isPublished(): bool
    {
        return $this === self::PUBLISHED;
    }

    public function isUnpublished(): bool
    {
        return $this === self::UNPUBLISHED;
    }

    public function isTrashed(): bool
    {
        return $this === self::TRASHED;
    }

    public function isArchived(): bool
    {
        return $this === self::ARCHIVED;
    }
}

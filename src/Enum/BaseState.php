<?php

declare(strict_types=1);

namespace Unicorn\Enum;

use Windwalker\Utilities\Contract\LanguageInterface;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;

/**
 * The BaseState class.
 */
enum BaseState: int implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    case PUBLISHED = 1;
    case UNPUBLISHED = 0;

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('unicorn.state.' . $this->name);
    }

    public function isPublished(): bool
    {
        return $this === self::PUBLISHED;
    }

    public function isUnpublished(): bool
    {
        return $this === self::UNPUBLISHED;
    }
}

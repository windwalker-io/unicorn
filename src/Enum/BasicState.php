<?php

declare(strict_types=1);

namespace Unicorn\Enum;

use Windwalker\Utilities\Contract\LanguageInterface;
use Windwalker\Utilities\Enum\EnumBCTrait;
use Windwalker\Utilities\Enum\EnumSingleton;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;

/**
 * The State class.
 *
 * @method static static UNPUBLISHED()
 * @method static static PUBLISHED()
 */
enum BasicState: int implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;
    use EnumBCTrait;

    case PUBLISHED = 1;
    case UNPUBLISHED = 0;

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('unicorn.state.' . $this->getKey());
    }

    public function isPublished(): bool
    {
        return $this->equals(static::PUBLISHED());
    }

    public function isUnpublished(): bool
    {
        return $this->equals(static::UNPUBLISHED());
    }
}

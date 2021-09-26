<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Enum;

use Windwalker\Utilities\Enum\EnumTranslatableTrait;

/**
 * The State class.
 *
 * @method static static ARCHIVED()
 * @method static static TRASHED()
 */
class PublishingState extends BasicState
{
    use EnumTranslatableTrait;

    public const TRASHED = -2;
    public const ARCHIVED = -1;
}

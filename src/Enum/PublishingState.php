<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Enum;

use MyCLabs\Enum\Enum;

/**
 * The State class.
 *
 * @method static static ARCHIVED()
 * @method static static TRASHED()
 */
class PublishingState extends BasicState
{
    public const TRASHED = -2;
    public const ARCHIVED = -1;
}

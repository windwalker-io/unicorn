<?php

/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Attributes;

/**
 * The ConfigureAction class.
 */
#[\Attribute(\Attribute::TARGET_METHOD)]
class ConfigureAction
{
    /**
     * ConfigureAction constructor.
     */
    public function __construct(public string $className)
    {
    }
}

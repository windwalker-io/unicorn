<?php

declare(strict_types=1);

namespace Unicorn\Attributes;

use Unicorn\Repository\Actions\ActionsFactory;

/**
 * The ConfigureAction class.
 */
#[\Attribute(\Attribute::TARGET_METHOD)]
class ConfigureAction
{
    public const IS_INSTANCE_OF = ActionsFactory::IS_INSTANCE_OF;

    /**
     * ConfigureAction constructor.
     */
    public function __construct(public string $className, public int $flags = 0)
    {
    }
}

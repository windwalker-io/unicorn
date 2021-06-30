<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Unicorn\UnicornPackage;
use Windwalker\Console\CommandWrapper;

/**
 * The RouteSubCommand class.
 */
#[CommandWrapper(
    description: 'Unicorn admin route.'
)]
class RouteSubCommand extends \Windwalker\Core\Generator\SubCommand\RouteSubCommand
{
    protected function getBaseDir(): string
    {
        return dirname(UnicornPackage::dir());
    }
}

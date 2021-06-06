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
 * The ModelSubCommand class.
 */
#[CommandWrapper(
    description: 'Unicorn model/entity.'
)]
class ModelSubCommand extends \Windwalker\Core\Generator\SubCommand\ModelSubCommand
{
    protected function getBaseDir(): string
    {
        return dirname(UnicornPackage::dir());
    }
}

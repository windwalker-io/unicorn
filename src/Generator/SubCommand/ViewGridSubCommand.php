<?php

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Windwalker\Console\CommandWrapper;

/**
 * The ModelSubCommand class.
 */
#[CommandWrapper(
    description: 'Unicorn grid view.'
)]
class ViewGridSubCommand extends AbstractViewSubCommand
{
    protected function getClassSuffix(): string
    {
        return 'ListView';
    }

    protected function getTmplPath(): string
    {
        return 'view/grid/**/*.tpl';
    }
}

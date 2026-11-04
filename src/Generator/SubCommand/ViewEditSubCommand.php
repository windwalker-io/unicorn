<?php

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Windwalker\Console\CommandWrapper;

/**
 * The ModelSubCommand class.
 */
#[CommandWrapper(
    description: 'Unicorn edit view.'
)]
class ViewEditSubCommand extends AbstractViewSubCommand
{
    protected function getClassSuffix(): string
    {
        return 'EditView';
    }

    protected function getTmplPath(): string
    {
        return 'view/edit/**/*.tpl';
    }
}

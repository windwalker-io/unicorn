<?php

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Windwalker\Console\CommandWrapper;

#[CommandWrapper(
    description: 'Unicorn list view.'
)]
class ViewItemSubCommand extends AbstractViewSubCommand
{
    protected function getClassSuffix(): string
    {
        return 'ItemView';
    }

    protected function getTmplPath(): string
    {
        return 'view/item/**/*.tpl';
    }
}

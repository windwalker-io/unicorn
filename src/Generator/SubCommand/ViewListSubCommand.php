<?php

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Windwalker\Console\CommandWrapper;

#[CommandWrapper(
    description: 'Unicorn item view.'
)]
class ViewListSubCommand extends AbstractViewSubCommand
{
    protected function getClassSuffix(): string
    {
        return 'ListView';
    }

    protected function getTmplPath(): string
    {
        return 'view/list/**/*.tpl';
    }
}

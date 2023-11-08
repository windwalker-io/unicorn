<?php

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Unicorn\UnicornPackage;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\IOInterface;
use Windwalker\Core\Generator\SubCommand\ViewSubCommand;
use Windwalker\Utilities\Str;

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

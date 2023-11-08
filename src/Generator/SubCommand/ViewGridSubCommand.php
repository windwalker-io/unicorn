<?php

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Unicorn\UnicornPackage;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\IOInterface;
use Windwalker\Utilities\Str;

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

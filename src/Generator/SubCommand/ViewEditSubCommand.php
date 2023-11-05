<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

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
    description: 'Unicorn edit view.'
)]
class ViewEditSubCommand extends \Windwalker\Core\Generator\SubCommand\ViewSubCommand
{
    /**
     * configure
     *
     * @param  Command  $command
     *
     * @return  void
     */
    public function configure(Command $command): void
    {
        parent::configure($command);

        $command->addOption(
            'model',
            'm',
            InputOption::VALUE_OPTIONAL,
            'Also generate model.',
            false
        );
    }

    /**
     * Interaction with user.
     *
     * @param  IOInterface  $io
     *
     * @return  void
     */
    public function interact(IOInterface $io): void
    {
        parent::interact($io);

        if ($io->getOption('model') === false) {
            $io->setOption('model', $io->ask(new ConfirmationQuestion('Also generate model? [Y/n]: ')));
        }
    }

    /**
     * Executes the current command.
     *
     * @param  IOInterface  $io
     *
     * @return  int Return 0 is success, 1-255 is failure.
     */
    public function execute(IOInterface $io): int
    {
        [, $name] = $this->getNameParts($io, 'EditView');
        $force = $io->getOption('force');

        if (!$name) {
            $io->errorStyle()->error('No view name');

            return 255;
        }

        $this->codeGenerator->from($this->getViewPath('view/edit/**/*.tpl'))
            ->replaceTo(
                $this->getDestPath($io, 'EditView'),
                [
                    'name' => Str::removeRight($name, 'EditView'),
                    'ns' => $this->getNamespace($io, 'EditView'),
                ],
                $force
            );

        if ($io->getOption('model')) {
            $name = $io->getArgument('name');
            $name = Str::removeRight($name, 'EditView');
            $modelName = \Windwalker\str($name)
                ->replace('\\', '/')
                ->explode('/')
                ->pop();

            $inoutOptions = $io->getInput()->getOptions();
            $options = [
                'name' => $modelName,
                '--dir' => $inoutOptions['dir'] ?? null,
                '--ns' => $inoutOptions['ns'] ?? null,
                '--force' => $inoutOptions['force'] ?? null,
                '--quite' => $inoutOptions['quiet'] ?? null,
                '--ansi' => $inoutOptions['ansi'] ?? null,
                '--no-interaction' => $inoutOptions['no-interaction'] ?? null,
            ];

            $options = array_filter($options);

            $this->app->runCommand(
                $this->app->make(ModelSubCommand::class),
                $options,
                $io
            );
        }

        return 0;
    }

    protected function getBaseDir(): string
    {
        return dirname(UnicornPackage::dir());
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Unicorn\UnicornPackage;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\IO;
use Windwalker\Console\IOInterface;
use Windwalker\Core\Generator\Command\GenerateCommand;
use Windwalker\Utilities\Str;

/**
 * The ControllerSubCommand class.
 */
#[CommandWrapper(
    description: 'Unicorn MVC controller.'
)]
class ControllerSubCommand extends \Windwalker\Core\Generator\SubCommand\ControllerSubCommand
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

    protected function getBaseDir(): string
    {
        return dirname(UnicornPackage::dir());
    }

    /**
     * Executes the current command.
     *
     * @param  IOInterface  $io
     *
     * @return  int Return 0 is success, 1-255 is failure.
     * @throws \Exception
     */
    public function execute(IOInterface $io): int
    {
        $result = parent::execute($io);

        if ($result !== 0) {
            // return $result;
        }

        if ($io->getOption('model') !== false) {
            $name = $io->getArgument('name');
            $name = Str::removeRight($name, 'Controller');
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

        return $result;
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Symfony\Component\Process\Process;
use Unicorn\UnicornPackage;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\IOInterface;
use Windwalker\Core\Generator\SubCommand\AbstractGeneratorSubCommand;
use Windwalker\Data\Collection;
use Windwalker\Utilities\Str;
use Windwalker\Utilities\StrNormalize;

use function Windwalker\collect;

/**
 * The ModelSubCommand class.
 */
#[CommandWrapper(
    description: 'Unicorn mvc admin.'
)]
class MvcAdminSubCommand extends AbstractGeneratorSubCommand
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
        $command->addArgument(
            'name',
            InputArgument::OPTIONAL,
        );

        // $command->addArgument(
        //     'dest',
        //     InputArgument::OPTIONAL,
        // );

        $command->addOption(
            'dir',
            'd',
            \Windwalker\Console\Input\InputOption::VALUE_REQUIRED,
            'Root dir.'
        );

        $command->addOption(
            'ns',
            null,
            InputOption::VALUE_REQUIRED,
            'Namespace.',
        );

        $command->addOption(
            'force',
            'f',
            InputOption::VALUE_NONE,
            'Force override files',
            null
        );

        $command->addOption(
            'grid',
            '',
            InputOption::VALUE_NONE,
            'Only generate grid',
            null
        );

        $command->addOption(
            'edit',
            '',
            InputOption::VALUE_NONE,
            'Only generate edit',
            null
        );
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
        $options = [
            '--ns' => $io->getOption('ns'),
            '--dir' => $io->getOption('dir'),
            '--force' => $io->getOption('force') ? '' : null,
        ];
        $optionString = '';

        $onlyGrid = $io->getOption('grid');
        $onlyEdit = $io->getOption('edit');
        $all = !$onlyGrid && !$onlyEdit;

        foreach ($options as $key => $value) {
            if ($value !== null) {
                $optionString = $key . ' ' . $value;
            }
        }

        $name = $io->getArgument('name');

        // Entity
        $entityName = \Windwalker\str($name)
            ->replace('\\', '/')
            ->explode('/')
            ->pop();

        $kebabName = (string) \Windwalker\str($name)
            ->replace('\\', '/')
            ->explode('/')
            ->map(StrNormalize::toKebabCase(...))
            ->implode('/');

        $this->runProcess(
            "php windwalker g unicorn:model $entityName " . $optionString,
            $io
        );

        // Migration
        $this->runProcess(
            "php windwalker mig:create {$entityName}Init {$entityName} --no-update",
            $io
        );

        // Seeder
        $seederName = Collection::explode('/', $kebabName)->pop();

        $this->runProcess(
            "php windwalker seed:create {$seederName}",
            $io
        );

        // Controller
        $this->runProcess(
            "php windwalker g unicorn:controller $name " . $optionString,
            $io,
            'y',
        );

        // View
        if ($all || $onlyGrid) {
            $this->runProcess(
                "php windwalker g unicorn:view-grid $name " . $optionString,
                $io,
                'n',
            );
        }

        if ($all || $onlyEdit) {
            $this->runProcess(
                "php windwalker g unicorn:view-edit $name " . $optionString,
                $io,
                'n'
            );
        }

        // Route
        $this->runProcess(
            "php windwalker g unicorn:route $kebabName " . $optionString,
            $io
        );

        return 0;
    }

    protected function runProcess(
        string $process,
        IOInterface $io,
        mixed $input = null,
    ): Process {
        $io->style()->title('>> ' . $process);

        return $this->app->runProcess(
            $process,
            $input,
            $io
        );
    }

    protected function getBaseDir(): string
    {
        return dirname(UnicornPackage::dir());
    }
}

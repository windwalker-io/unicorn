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
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Unicorn\UnicornPackage;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\IOInterface;
use Windwalker\Core\Generator\SubCommand\AbstractGeneratorSubCommand;
use Windwalker\Utilities\StrNormalize;

/**
 * The GenEnumSubCommand class.
 */
#[CommandWrapper(
    description: 'Unicorn workflow.'
)]
class WorkflowSubCommand extends AbstractGeneratorSubCommand
{
    protected string $defaultNamespace = 'App\\Workflow';

    protected string $defaultDir = 'src/Workflow';

    protected bool $requireDest = false;

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

        $command->addArgument(
            'field',
            InputArgument::OPTIONAL,
            'The workflow field for this table.'
        );

        $command->addOption(
            'options',
            'o',
            InputOption::VALUE_OPTIONAL
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
        [, $name] = $this->getNameParts($io);
        $force = $io->getOption('force');

        if (!$name) {
            $io->errorStyle()->error('No view name');

            return 255;
        }

        $field = $io->getArgument('field');

        if (!$field) {
            $defField = StrNormalize::toSnakeCase($name);
            $field = $io->ask("Workflow field [$defField]: ") ?: $defField;
        }

        $this->codeGenerator->from($this->getViewPath('workflow/*.tpl'))
            ->replaceTo(
                $this->getDestPath($io),
                [
                    'name' => $name,
                    'field' => $field,
                    'ns' => $this->getNamesapce($io),
                ],
                $force
            );

        return 0;
    }

    protected function getBaseDir(): string
    {
        return dirname(UnicornPackage::dir());
    }
}

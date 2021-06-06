<?php

/**
 * Part of starter project.
 *
 * @copyright    Copyright (C) 2021 __ORGANIZATION__.
 * @license        __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Generator\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Exception\InvalidArgumentException;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Windwalker\Console\CommandInterface;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\InteractInterface;
use Windwalker\Console\IOInterface;
use Windwalker\Core\Generator\Builder\FormFieldsBuilder;
use Windwalker\Core\Utilities\ClassFinder;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\Filesystem\Filesystem;
use Windwalker\ORM\ORM;
use Windwalker\Utilities\StrNormalize;

/**
 * The BuildFormCommand class.
 */
#[CommandWrapper(
    description: 'Build form definition from DB table.'
)]
class BuildFormCommand implements CommandInterface, InteractInterface
{
    private IOInterface $io;

    /**
     * BuildEntityCommand constructor.
     */
    public function __construct(#[Autowire] protected ClassFinder $classFinder, protected ORM $orm)
    {
    }

    /**
     * configure
     *
     * @param    Command  $command
     *
     * @return    void
     */
    public function configure(Command $command): void
    {
        $command->addArgument(
            'class',
            InputArgument::REQUIRED,
            'The form definition class name.'
        );

        $command->addArgument(
            'table',
            InputArgument::REQUIRED,
            'The table or entity name that to fetch DB columns.'
        );

        $command->addOption(
            'base-ns',
            null,
            InputOption::VALUE_REQUIRED,
            'The base namespace.',
            'App\\Module'
        );

        $command->addOption(
            'use-lang',
            null,
            InputOption::VALUE_OPTIONAL,
            'To use language translate label name.',
            false
        );

        $command->addOption(
            'dry-run',
            'd',
            InputOption::VALUE_NONE,
            'Do not replace origin file.'
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
        if ($io->getOption('use-lang') === null) {
            $io->setOption('use-lang', $io->ask('Language prefix: '));
        }
    }

    /**
     * Executes the current command.
     *
     * @param    IOInterface  $io
     *
     * @return    int Return 0 is success, 1-255 is failure.
     */
    public function execute(IOInterface $io): int
    {
        $this->io = $io;

        $class = $io->getArgument('class');
        $table = $io->getArgument('table');

        if (str_contains($class, '*')) {
            throw new InvalidArgumentException('Unable use multiple classes.');
        }

        $class = StrNormalize::toClassNamespace($io->getOption('base-ns') . '\\' . $class);

        $tbm = $this->orm->getDb()->getTable($table);

        $ref = new \ReflectionClass($class);

        $builder = new FormFieldsBuilder($ref->getName(), $tbm);
        $newCode = $builder->process($io->getOptions(), $added);

        if (!$this->io->getOption('dry-run')) {
            Filesystem::write($ref->getFileName(), $newCode);
        }

        if ($added) {
            $io->writeln("Updated <info>{$class}</info> to add fields:");

            foreach ($added as $col) {
                $io->writeln("  - $col");
            }
        } else {
            $io->writeln('No changes for <info>{$class}</info>');
        }

        $io->newLine();

        return 0;
    }
}

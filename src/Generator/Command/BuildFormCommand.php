<?php

declare(strict_types=1);

namespace Unicorn\Generator\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Exception\InvalidArgumentException;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Unicorn\Form\FormFieldsBuilder;
use Windwalker\Console\CommandInterface;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\CompletionContext;
use Windwalker\Console\CompletionHandlerInterface;
use Windwalker\Console\InteractInterface;
use Windwalker\Console\IOInterface;
use Windwalker\Core\Command\CommandPackageResolveTrait;
use Windwalker\Core\Console\ConsoleApplication;
use Windwalker\Core\Database\Command\CommandDatabaseTrait;
use Windwalker\Core\Utilities\ClassFinder;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\Filesystem\Filesystem;
use Windwalker\Filesystem\Path;
use Windwalker\Utilities\Str;
use Windwalker\Utilities\StrNormalize;

use function Windwalker\collect;

/**
 * The BuildFormCommand class.
 */
#[CommandWrapper(
    description: 'Build form definition from DB table.'
)]
class BuildFormCommand implements CommandInterface, InteractInterface, CompletionHandlerInterface
{
    use CommandDatabaseTrait;
    use CommandPackageResolveTrait;

    private IOInterface $io;

    /**
     * BuildEntityCommand constructor.
     */
    public function __construct(
        #[Autowire] protected ClassFinder $classFinder,
        protected ConsoleApplication $app,
    ) {
    }

    /**
     * configure
     *
     * @param  Command  $command
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
            'ns',
            null,
            InputOption::VALUE_REQUIRED,
            'The base namespace.',
        );

        $this->configurePackageOptions(
            $command,
            'Package name to find namespace.'
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

        $this->configureDatabaseOptions($command);
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
     * @param  IOInterface  $io
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

        $ns = $this->getPackageNamespace($io, 'Module') ?? $io->getOption('ns') ?? 'App\\Module';

        $class = StrNormalize::toClassNamespace(Str::ensureRight($ns, '\\') . $class);

        $db = $this->databaseManager->get($io->getOption('connection'));
        $tbm = $db->getTableManager($table);

        $ref = new \ReflectionClass($class);

        $builder = new FormFieldsBuilder($ref->getName(), $tbm);
        $builder->addEventDealer($this->app);
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
            $io->writeln("No changes for <info>{$class}</info>");
        }

        $io->newLine();

        return 0;
    }

    /**
     * @inheritDoc
     */
    public function completeOptionValues($optionName, CompletionContext $context)
    {
        return null;
    }

    /**
     * @inheritDoc
     */
    public function completeArgumentValues($argumentName, CompletionContext $context)
    {
        if ($argumentName === 'class') {
            $classes = $this->classFinder->findClasses('App\\', true);
            $classes = iterator_to_array($classes);
            $classes = collect($classes)
                ->filter(fn($class) => str_ends_with(strtolower($class), 'form'))
                ->map(fn($class) => Path::clean($class, '/'))
                ->map(fn($class) => Str::removeLeft($class, 'App/Module/'))
                ->dump();

            return $classes;
        }

        return null;
    }

    public function handleCompletions(CompletionContext $context): ?array
    {
        if ($context->isArgument()) {
            if ($context->name === 'class') {
                $ns = $this->getPackageNamespace($context->io) ?: 'App\\';

                $classes = $this->classFinder->findClasses($ns, true);

                $classes = iterator_to_array($classes);
                $classes = collect($classes)
                    ->filter(fn($class) => str_ends_with(strtolower($class), 'form'))
                    ->map(fn($class) => Path::clean($class, '/'))
                    ->map(fn($class) => Str::removeLeft($class, Path::clean($ns, '/') . 'Module/'))
                    ->dump();

                return $classes;
            }

            if ($context->name === 'table') {
                try {
                    $db = $this->databaseManager->get($context->getOption('connection'));
                    $tables = $db->getSchemaManager()->getTables();

                    return array_keys($tables);
                } catch (\Throwable $e) {
                    $context->io->errorStyle()->text($e->getMessage());

                    return [];
                }
            }
        }

        if ($context->isOption() && $context->name === 'pkg') {
            $packages = $this->packageRegistry->getPackagesKeyByName();

            return array_keys($packages);
        }

        return null;
    }
}

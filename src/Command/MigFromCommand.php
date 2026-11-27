<?php

declare(strict_types=1);

namespace Unicorn\Command;

use PhpParser\BuilderFactory;
use PhpParser\Node;
use PhpParser\NodeTraverser;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Unicorn\Migration\ColumnDefinition;
use Unicorn\Migration\ExcelMigrationSource;
use Unicorn\Migration\MigrationSourceInterface;
use Unicorn\Migration\TableDefinition;
use Unicorn\Migration\YamlMigrationSource;
use Windwalker\Console\CommandInterface;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\IOInterface;
use Windwalker\Core\Application\PathResolver;
use Windwalker\Core\Console\ConsoleApplication;
use Windwalker\Core\Generator\Builder\CallbackAstBuilder;
use Windwalker\Core\Migration\Exception\MigrationExistsException;
use Windwalker\Core\Migration\MigrationService;
use Windwalker\Data\Collection;
use Windwalker\Utilities\StrInflector;
use Windwalker\Utilities\StrNormalize;


/**
 * The MigFromCommand class.
 */
#[CommandWrapper(description: 'Migrations from excel or yaml files')]
class MigFromCommand implements CommandInterface
{
    /**
     * MigFromCommand constructor.
     */
    public function __construct(
        protected ConsoleApplication $app,
        protected MigrationService $migrationService
    ) {}

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
            'file',
            InputArgument::REQUIRED,
            'Excel (xls, xlsx, csv) or YAML (yml, yaml) file to import.'
        );
        $command->addOption(
            'mig',
            'm',
            InputOption::VALUE_NONE,
            'Run migration.'
        );
        $command->addOption(
            'build',
            'b',
            InputOption::VALUE_NONE,
            'Build entities.'
        );
        $command->addOption(
            'force',
            'f',
            InputOption::VALUE_OPTIONAL,
            'Force override.',
            false
        );
    }

    /**
     * Executes the current command.
     *
     * @param  IOInterface  $io
     *
     * @return  int  Return 0 is success, 1-255 is failure.
     */
    public function execute(IOInterface $io): int
    {
        $file = $io->getArgument('file');

        $io->writeln('Extracting file....');

        $analysis = $this->createMigrationSource($file)->analyze($file);
        $migGroups = $analysis->migrationGroups;
        $emptyTypes = $analysis->emptyTypes;

        if ($emptyTypes) {
            $io->style()->error('Found columns with empty Type. Please fix the source file and run again.');

            foreach ($emptyTypes as $tableName => $columns) {
                $io->writeln("Table <comment>$tableName</comment>:");

                foreach ($columns as $column) {
                    $io->writeln("  - Column <info>$column</info>");
                }
            }

            return 1;
        }

        $entities = [];
        $existsTables = [];

        foreach ($migGroups as $groupName => $tables) {
            $groupName = StrNormalize::toPascalCase($groupName);

            try {
                $files = $this->migrationService->copyMigrationFile(
                    $this->app->service(PathResolver::class)->resolve('@migrations'),
                    $groupName . 'Init',
                    __DIR__ . '/../../../core/resources/templates/migration/create/*',
                );

                $dest = $files->getResults()[0];
            } catch (MigrationExistsException $e) {
                $io->writeln($e->getMessage());

                $mig = $e->getMigration();

                $dest = $mig->file;
            }

            $i = 0;
            $uses = 0;
            $usesList = [];
            $factory = new BuilderFactory();

            $leaveNode = function (
                Node $node
            ) use (
                $io,
                $tables,
                &$i,
                &$uses,
                $factory,
                &$entities,
                &$usesList,
                &$existsTables
            ) {
                if ($node instanceof Node\Stmt\Use_) {
                    $use = (string) $node->uses[0]->name;
                    $use = Collection::explode('\\', $use)->pop();

                    $tableName = strtolower(StrNormalize::toUnderscoreSeparated(StrInflector::toPlural($use)));

                    if (array_key_exists($tableName, $tables)) {
                        return NodeTraverser::REMOVE_NODE;
                    }
                }

                if ($node instanceof Node\Stmt\Namespace_) {
                    foreach ($node->stmts as $stmt) {
                        if ($stmt instanceof Node\Stmt\Use_) {
                            $uses++;
                            $usesList[] = (string) $stmt->uses[0]->name;
                        }
                    }

                    foreach ($tables as $tableName => $table) {
                        $className = StrNormalize::toPascalCase(StrInflector::toSingular($tableName));
                        $entities[] = $entityClass = 'App\Entity\\' . $className;

                        if (in_array($entityClass, $usesList, true)) {
                            continue;
                        }

                        array_unshift(
                            $node->stmts,
                            $factory->use($entityClass)->getNode()
                        );
                    }
                }

                if (
                    $node instanceof Node\Stmt\Expression
                    && $node->expr instanceof Node\Expr\MethodCall
                    && (string) $node->expr->var->name === 'this'
                    && (string) $node->expr->name === 'createTable'
                ) {
                    $tableClass = $node->expr->args[0]->value;

                    if ($tableClass instanceof Node\Expr\ClassConstFetch) {
                        $className = (string) $tableClass->class;
                        $tableName = strtolower(
                            StrNormalize::toUnderscoreSeparated(StrInflector::toPlural($className))
                        );

                        if (array_key_exists($tableName, $tables)) {
                            $existsTables[] = $tableName;

                            return new Node\Stmt\Expression(
                                new Node\Scalar\String_('@create-' . $tableName)
                            );
                        }
                    }
                }

                if ($node instanceof Node\Stmt\ClassMethod) {
                    if ($this->hasAttribute($node, 'MigrateUp')) {
                        foreach ($tables as $tableName => $table) {
                            if (!in_array($tableName, $existsTables, true)) {
                                $node->stmts[] = new Node\Stmt\Expression(
                                    new Node\Scalar\String_('@create-' . $tableName)
                                );
                            }
                        }
                    }

                    if ($this->hasAttribute($node, 'MigrateDown')) {
                        foreach ($tables as $tableName => $table) {
                            if (!in_array($tableName, $existsTables, true)) {
                                $node->stmts[] = new Node\Stmt\Expression(
                                    new Node\Scalar\String_('@drop-' . $tableName)
                                );
                            }
                        }
                    }
                }

                if ($node instanceof Node\Expr\MethodCall) {
                    if ($node->var->name === 'mig' && (string) $node->name === 'up') {
                        $func = $node->args[0]->value;

                        if ($func instanceof Node\Expr\Closure) {
                            foreach ($tables as $tableName => $table) {
                                if (!in_array($tableName, $existsTables, true)) {
                                    $func->stmts[] = new Node\Stmt\Expression(
                                        new Node\Scalar\String_('@create-' . $tableName)
                                    );
                                }
                            }
                        }
                    }

                    if ($node->var->name === 'mig' && (string) $node->name === 'down') {
                        $func = $node->args[0]->value;

                        if ($func instanceof Node\Expr\Closure) {
                            foreach ($tables as $tableName => $table) {
                                if (!in_array($tableName, $existsTables, true)) {
                                    $func->stmts[] = new Node\Stmt\Expression(
                                        new Node\Scalar\String_('@drop-' . $tableName)
                                    );
                                }
                            }
                        }
                    }
                }

                return null;
            };

            $builder = new CallbackAstBuilder(
                (string) $dest->read(),
                null,
                $leaveNode
            );
            $newCode = $builder->process();

            foreach ($tables as $tableName => $table) {
                $className = StrNormalize::toPascalCase(StrInflector::toSingular($tableName));

                $io->writeln('$ php windwalker g entity ' . $className);

                $this->app->runProcess(
                    'php windwalker g entity ' . $className,
                    null,
                    $io->getOutput()
                );

                $cols = array_map(
                    fn(ColumnDefinition $column) => $this->buildColumn($column, $tableName),
                    $table->columns
                );

                $newCode = str_replace(
                    [
                        "'@create-{$tableName}';",
                        "'@drop-{$tableName}';",
                    ],
                    [
                        $this->buildCreateTable($className, $cols, $table),
                        $this->buildDropTable($className),
                    ],
                    $newCode
                );
            }

            $dest->write($newCode);
        }

        $runMig = $io->getOption('mig')
            || $io->ask(new ConfirmationQuestion('Do you want to run migration reset? [Y/n] '));

        // Todo: Remove after make sure migration ignore-errors works well.
        // if ($runMig) {
        //     $io->style()->warning(
        //         'Please make sure you comment all the code using empty entities. ' .
        //         'For example, if there is an empty `App\\Entity\\User`, then the creating of first User ' .
        //         'in UserInit.php will cause error, please comment it.'
        //     );
        //     $runMig = $io->askConfirmation('Yes I Checked, press [ENTER] to continue, enter [n] to cancel: ', true);
        // }

        if ($runMig) {
            $process = $this->app->runProcess(
                'php windwalker mig:reset -f --no-backup -e',
                null,
                $io->getOutput()
            );

            if (!$process->isSuccessful()) {
                throw new \RuntimeException($process->getErrorOutput());
            }

            $build = $io->getOption('build')
                || $io->ask(
                    new ConfirmationQuestion('Do you want to build entity properties? [Y/n] ')
                );

            if ($build) {
                $genEnums = $io->askConfirmation(
                    'If there has comments starts with <info>"enum:"</info>, do you want to auto generate non-exists Enums? [Y/n] ',
                    true
                );

                foreach ($entities as $entity) {
                    $cmd = sprintf(
                        'php windwalker build:entity "%s" %s',
                        $entity,
                        $genEnums ? '--auto-gen-enums' : ''
                    );

                    $io->writeln('>> ' . $cmd);
                    $process = $this->app->runProcess(
                        $cmd,
                        null,
                        $io->getOutput()
                    );
                }
            }
        }

        $io->newLine();
        $io->writeln('Run completed.');

        return 0;
    }

    /**
     * @param  list<string>  $cols
     */
    protected function buildCreateTable(string $className, array $cols, TableDefinition $table): string
    {
        $declare = implode("\n" . str_repeat(' ', 16), $cols);

        $groups = [
            'addIndex' => $table->indexes,
            'addUniqueKey' => $table->uniques,
        ];

        foreach ($groups as $method => $keyList) {
            if ($keyList === []) {
                continue;
            }

            $declare .= "\n";

            foreach ($keyList as $keyCols) {
                $declare .= "\n" . str_repeat(' ', 16) . "\$schema->$method(" . $this->exportColumns($keyCols) . ');';
            }
        }

        if ($table->primary !== []) {
            $declare .= "\n\n" . str_repeat(' ', 16)
                . "\$schema->addPrimaryKey(" . $this->exportColumns($table->primary) . ');';
        }

        $code = <<<PHP
\$this->createTable(
            {$className}::class,
            function (Schema \$schema) {
                $declare
            }
        );
PHP;

        return $code;
    }

    /**
     * @param  list<string>  $cols
     */
    protected function exportColumns(array $cols): string
    {
        $cols = array_map(fn(string $col) => "'$col'", $cols);

        return count($cols) === 1 ? $cols[0] : '[' . implode(', ', $cols) . ']';
    }

    protected function buildDropTable(string $className): string
    {
        return "\$this->dropTables({$className}::class);";
    }

    protected function createMigrationSource(string $file): MigrationSourceInterface
    {
        return match (strtolower(pathinfo($file, PATHINFO_EXTENSION))) {
            'yml', 'yaml' => new YamlMigrationSource(),
            default => new ExcelMigrationSource(),
        };
    }

    protected function buildColumn(ColumnDefinition $column, ?string $tableName = null): string
    {
        $name = $column->name;
        $method = $this->getTypeMethod($column);

        if (!$method) {
            if ($tableName) {
                $tableName .= '.';
            }

            throw new \RuntimeException("Unknown type '{$column->type}' for column {$tableName}{$name}.");
        }

        $col = "\$schema->$method('$name')";

        if ($column->length !== null) {
            $length = is_numeric($column->length) ? $column->length : "'{$column->length}'";

            $col .= "->length($length)";
        }

        if ($method === 'json' || $column->nullable) {
            $col .= '->nullable(true)';
        }

        // Serial primary keys are already created by the primary*() methods.
        if ($column->primary && !$column->serial) {
            $col .= '->primary(true)';
        }

        if ($column->serial && !$column->primary) {
            $col .= '->autoIncrement(true)';
        }

        if ($column->unsigned) {
            $col .= '->unsigned(true)';
        }

        if ($column->default !== null) {
            $default = is_numeric($column->default) ? $column->default : "'{$column->default}'";

            $col .= "->defaultValue($default)";
        }

        $comment = $column->getComment();

        if ($comment !== '') {
            $col .= "->comment('$comment')";
        }

        $col .= ';';

        return $col;
    }

    protected function typeMap(string $type): string
    {
        return match ($type) {
            'int' => 'integer',
            default => $type,
        };
    }

    public function getTypeMethod(ColumnDefinition $column): string
    {
        $type = $this->typeMap($column->type);

        $method = $type;

        if ($column->primary && $column->serial) {
            if ($type === 'integer') {
                $method = 'primary';
            } elseif ($type === 'bigint') {
                $method = 'primaryBigint';
            } elseif ($type === 'uuid') {
                $method = 'primaryUuidChar';
            } elseif ($type === 'uuidbin') {
                $method = 'primaryUuidBinary';
            } else {
                $method = 'primary';
            }
        } else {
            if ($type === 'uuid') {
                $method = 'uuidChar';
            } elseif ($type === 'uuidbin') {
                $method = 'uuidBinary';
            }
        }

        return $method;
    }

    protected function hasAttribute(Node $node, string $name): bool
    {
        foreach ($node->attrGroups as $attrGroup) {
            foreach ($attrGroup->attrs as $attr) {
                if ($attr->name->toString() === $name) {
                    return true;
                }
            }
        }

        return false;
    }
}

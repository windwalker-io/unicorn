<?php

declare(strict_types=1);

namespace Unicorn\Command;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpParser\BuilderFactory;
use PhpParser\Node;
use PhpParser\NodeTraverser;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Unicorn\Excel\ExcelImporter;
use Windwalker\Console\CommandInterface;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\IOInterface;
use Windwalker\Core\Console\ConsoleApplication;
use Windwalker\Core\Generator\Builder\CallbackAstBuilder;
use Windwalker\Core\Migration\Exception\MigrationExistsException;
use Windwalker\Core\Migration\MigrationService;
use Windwalker\Data\Collection;
use Windwalker\Filesystem\FileObject;
use Windwalker\Utilities\Str;
use Windwalker\Utilities\StrInflector;
use Windwalker\Utilities\StrNormalize;

use Windwalker\Utilities\Utf8String;

use function Windwalker\collect;
use function Windwalker\uid;

/**
 * The MigFromCommand class.
 */
#[CommandWrapper(description: 'Migrations from excel files')]
class MigFromCommand implements CommandInterface
{
    /**
     * MigFromCommand constructor.
     */
    public function __construct(
        protected ConsoleApplication $app,
        protected MigrationService $migrationService
    ) {
    }

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
            'Excel file to import.'
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
     * @return  int Return 0 is success, 1-255 is failure.
     */
    public function execute(IOInterface $io): int
    {
        $file = $io->getArgument('file');

        $io->writeln('Extracting file....');

        if (!class_exists(Spreadsheet::class)) {
            throw new \DomainException('Please install phpoffice/phpspreadsheet first.');
        }

        $excel = new ExcelImporter($file);
        $migGroups = [];

        foreach ($excel->getSheetsIterator(true) as $sheet => $rows) {
            if ($sheet[0] === '_' || $sheet === 'Sample' || !Utf8String::isAscii($sheet)) {
                continue;
            }

            $tableName = $sheet;

            $rows = iterator_to_array($rows);

            $firstKey = array_key_first($rows[array_key_first($rows)]);

            if ($firstKey !== 'Name') {
                continue;
            }

            $migGroups[$this->getGroupName($tableName)][$tableName] = $rows;
        }

        $entities = [];
        $existsTables = [];

        foreach ($migGroups as $groupName => $tables) {
            $groupName = StrNormalize::toPascalCase($groupName);

            try {
                $files = $this->migrationService->copyMigrationFile(
                    WINDWALKER_MIGRATIONS,
                    $groupName . 'Init',
                    __DIR__ . '/../../../core/resources/templates/migration/*',
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

            $leaveNode = function (Node $node) use ($io, $tables, &$i, &$uses, $factory, &$entities, &$usesList, &$existsTables) {
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

                    foreach ($tables as $tableName => $rows) {
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
                    && (string) $node->expr->var->name === 'mig'
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

                if ($node instanceof Node\Expr\MethodCall) {
                    if ($node->var->name === 'mig' && (string) $node->name === 'up') {
                        $func = $node->args[0]->value;

                        if ($func instanceof Node\Expr\Closure) {
                            foreach ($tables as $tableName => $rows) {
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
                            foreach ($tables as $tableName => $rows) {
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

            foreach ($tables as $tableName => $rows) {
                $className = StrNormalize::toPascalCase(StrInflector::toSingular($tableName));

                $io->writeln('$ php windwalker g entity ' . $className);

                $this->app->runProcess(
                    'php windwalker g entity ' . $className,
                    null,
                    $io->getOutput()
                );

                $keys = [];
                $cols = [];

                foreach ($rows as $row) {
                    if (empty($row['Name'])) {
                        continue;
                    }

                    $cols[] = $this->buildColumn($row, $keys);
                }

                $newCode = str_replace(
                    [
                        "'@create-{$tableName}';",
                        "'@drop-{$tableName}';"
                    ],
                    [
                        $this->buildCreateTable($className, $cols, $keys),
                        $this->buildDropTable($className)
                    ],
                    $newCode
                );
            }

            $dest->write($newCode);
        }

        $runMig = $io->getOption('mig') ?: $io->ask(new ConfirmationQuestion('Do you want to run migration? [Y/n] '));
        if ($runMig) {
            $process = $this->app->runProcess(
                'php windwalker mig:go -f --no-backup',
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
                foreach ($entities as $entity) {
                    $io->writeln('>> php windwalker build:entity "' . $entity . '"');
                    $process = $this->app->runProcess(
                        'php windwalker build:entity "' . $entity . '"',
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

    protected function buildCreateTable(string $className, array $cols, array $keys): string
    {
        $declare = implode("\n" . str_repeat(' ', 16), $cols);

        if ($keys['index'] ?? null) {
            $declare .= "\n";

            foreach ($keys['index'] as $idxName => $idxCols) {
                $idxCols = collect($idxCols)
                    ->map(fn ($v) => "'$v'");

                $idxCols = \Windwalker\count($idxCols) === 1 ? $idxCols[0] : '[' . $idxCols->implode(', ') . ']';

                $declare .= "\n" . str_repeat(' ', 16) . "\$schema->addIndex($idxCols);";
            }
        }

        if ($keys['unique'] ?? null) {
            $declare .= "\n";

            foreach ($keys['unique'] as $idxName => $idxCols) {
                $idxCols = collect($idxCols)
                    ->map(fn ($v) => "'$v'");

                $idxCols = \Windwalker\count($idxCols) === 1 ? $idxCols[0] : '[' . $idxCols->implode(', ') . ']';

                $declare .= "\n" . str_repeat(' ', 16) . "\$schema->addUniqueKey($idxCols);";
            }
        }
        
        $code = <<<PHP
\$mig->createTable(
            {$className}::class,
            function (Schema \$schema) {
                $declare
            }
        );
PHP;

        return $code;
    }

    protected function buildDropTable(string $className): string
    {
        return "\$mig->dropTables({$className}::class);";
    }

    protected function buildColumn(array $row, ?array &$keys = null): string
    {
        $keys ??= [];

        $name = trim($row['Name'] ?? '');
        $type = trim($row['Type'] ?? 'varchar');
        $length = trim($row['Length'] ?? '');
        $null = trim($row['NULL'] ?? '');
        $signed = trim($row['Signed'] ?? '');
        $default = trim($row['Default'] ?? '');
        $key = trim($row['Key'] ?? '');
        $keyName = trim($row['Key Name'] ?? '');
        $description = trim($row['Description'] ?? '');
        $note = trim($row['Note'] ?? '');

        $method = $this->getTypeMethod($key, $type);

        $col = "\$schema->$method('$name')";

        if ($length) {
            if (!is_numeric($length)) {
                $length = "'$length'";
            }

            $col .= "->length($length)";
        }

        if ($method === 'json' || strtolower(trim($null)) === 'allow') {
            $col .= "->nullable(true)";
        }

        if (strtolower(trim($signed)) === 'unsigned') {
            $col .= "->unsigned(true)";
        }

        if ((string) $default !== '') {
            if (!is_numeric($default)) {
                $default = "'$default'";
            }

            $col .= "->defaultValue($default)";
        }

        if (!$keyName) {
            $keyName = uid();
        }

        if (strtolower($key) === 'index') {
            $keys['index'][$keyName][] = $name;
        } elseif (strtolower($key) === 'unique') {
            $keys['unique'][$keyName][] = $name;
        }

        if ($description || $note) {
            $comment = array_filter([$description, $note]);
            $comment = implode(' - ', $comment);

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

    protected function getGroupName(string $tableName): string
    {
        [$name] = explode('_', $tableName, 2);

        return StrInflector::toSingular(strtolower($name));
    }

    /**
     * @param  string  $key
     * @param  string  $type
     *
     * @return  string
     */
    public function getTypeMethod(string $key, string $type): string
    {
        $type = $this->typeMap($type);

        $method = $type;

        if (strtolower($key) === 'primary (ai)') {
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
}

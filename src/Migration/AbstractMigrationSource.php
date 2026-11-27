<?php

declare(strict_types=1);

namespace Unicorn\Migration;

use Windwalker\Utilities\StrInflector;
use Windwalker\Utilities\Utf8String;

abstract class AbstractMigrationSource implements MigrationSourceInterface
{
    /**
     * @param  iterable<TableDefinition>  $tables
     */
    protected function buildAnalysis(iterable $tables): MigrationSourceAnalysis
    {
        $migrationGroups = [];
        $emptyTypes = [];

        foreach ($tables as $table) {
            foreach ($table->columns as $column) {
                if (trim($column->type) === '') {
                    $emptyTypes[$table->name][] = $column->name;
                }
            }

            $migrationGroups[$this->getGroupName($table->name)][$table->name] = $table;
        }

        return new MigrationSourceAnalysis($migrationGroups, $emptyTypes);
    }

    protected function isTableName(mixed $name): bool
    {
        return is_string($name)
            && $name !== ''
            && $name[0] !== '_'
            && $name !== 'Sample'
            && Utf8String::isAscii($name);
    }

    protected function getGroupName(string $tableName): string
    {
        [$name] = explode('_', $tableName, 2);

        return StrInflector::toSingular(strtolower($name));
    }
}

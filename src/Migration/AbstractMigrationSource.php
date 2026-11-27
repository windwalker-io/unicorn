<?php

declare(strict_types=1);

namespace Unicorn\Migration;

use Windwalker\Utilities\StrInflector;
use Windwalker\Utilities\Utf8String;

abstract class AbstractMigrationSource implements MigrationSourceInterface
{
    /**
     * @param  iterable<string, array<int, array<string, mixed>>>  $tables  Table name => column rows.
     * @param  array<string, array<string, mixed>>  $tableKeys
     */
    protected function buildAnalysis(iterable $tables, array $tableKeys = []): MigrationSourceAnalysis
    {
        $migrationGroups = [];
        $emptyTypes = [];

        foreach ($tables as $tableName => $rows) {
            if (!$this->isTableName($tableName)) {
                continue;
            }

            foreach ($rows as $row) {
                if (empty($row['Name'])) {
                    continue;
                }

                if (trim((string) ($row['Type'] ?? '')) === '') {
                    $emptyTypes[$tableName][] = trim((string) $row['Name']);
                }
            }

            $migrationGroups[$this->getGroupName($tableName)][$tableName] = $rows;
        }

        return new MigrationSourceAnalysis($migrationGroups, $emptyTypes, $tableKeys);
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

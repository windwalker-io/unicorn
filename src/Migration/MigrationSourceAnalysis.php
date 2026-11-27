<?php

declare(strict_types=1);

namespace Unicorn\Migration;

final readonly class MigrationSourceAnalysis
{
    /**
     * @param  array<string, array<string, TableDefinition>>  $migrationGroups  Group name => table name => table.
     * @param  array<string, list<string>>                    $emptyTypes       Table name => columns without type.
     */
    public function __construct(
        public array $migrationGroups,
        public array $emptyTypes,
    ) {}
}

<?php

declare(strict_types=1);

namespace Unicorn\Migration;

final readonly class MigrationSourceAnalysis
{
    /**
     * @param  array<string, array<string, array<int, array<string, mixed>>>>  $migrationGroups
     * @param  array<string, list<string>>                                     $emptyTypes
     * @param  array<string, array{primary?: list<string>, index?: list<list<string>>, unique?: list<list<string>>}>  $tableKeys
     *         Table-level keys by table name. Excel sources keep keys on column rows instead.
     */
    public function __construct(
        public array $migrationGroups,
        public array $emptyTypes,
        public array $tableKeys = [],
    ) {}
}

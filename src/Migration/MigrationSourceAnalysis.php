<?php

declare(strict_types=1);

namespace Unicorn\Migration;

final readonly class MigrationSourceAnalysis
{
    /**
     * @param  array<string, array<string, array<int, array<string, mixed>>>>  $migrationGroups
     * @param  array<string, list<string>>                                     $emptyTypes
     */
    public function __construct(
        public array $migrationGroups,
        public array $emptyTypes,
    ) {}
}

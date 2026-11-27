<?php

declare(strict_types=1);

namespace Unicorn\Migration;

interface MigrationSourceInterface
{
    public function analyze(string $source): MigrationSourceAnalysis;
}

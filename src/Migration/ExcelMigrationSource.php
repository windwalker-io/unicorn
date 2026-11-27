<?php

declare(strict_types=1);

namespace Unicorn\Migration;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Unicorn\Excel\ExcelImporter;

class ExcelMigrationSource extends AbstractMigrationSource
{
    public function analyze(string $source): MigrationSourceAnalysis
    {
        if (!class_exists(Spreadsheet::class)) {
            throw new \DomainException('Please install phpoffice/phpspreadsheet first.');
        }

        $excel = new ExcelImporter($source);

        return $this->buildAnalysis($this->iterateTables($excel));
    }

    /**
     * @return  \Generator<string, array<int, array<string, mixed>>>
     */
    protected function iterateTables(ExcelImporter $excel): \Generator
    {
        foreach ($excel->getSheetsIterator(true) as $sheet => $rows) {
            if (!$this->isTableName($sheet)) {
                continue;
            }

            $rows = iterator_to_array($rows);
            $firstRow = $rows[array_key_first($rows)] ?? [];

            if (array_key_first($firstRow) !== 'Name') {
                continue;
            }

            yield $sheet => $rows;
        }
    }
}

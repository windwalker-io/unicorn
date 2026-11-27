<?php

declare(strict_types=1);

namespace Unicorn\Migration;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Unicorn\Excel\ExcelImporter;
use Windwalker\Utilities\StrInflector;
use Windwalker\Utilities\Utf8String;

class ExcelMigrationSource implements MigrationSourceInterface
{
    public function analyze(string $source): MigrationSourceAnalysis
    {
        if (!class_exists(Spreadsheet::class)) {
            throw new \DomainException('Please install phpoffice/phpspreadsheet first.');
        }

        $excel = new ExcelImporter($source);
        $migrationGroups = [];
        $emptyTypes = [];

        foreach ($excel->getSheetsIterator(true) as $sheet => $rows) {
            if (
                !is_string($sheet)
                || $sheet === ''
                || $sheet[0] === '_'
                || $sheet === 'Sample'
                || !Utf8String::isAscii($sheet)
            ) {
                continue;
            }

            $tableName = $sheet;
            $rows = iterator_to_array($rows);
            $firstRow = $rows[array_key_first($rows)] ?? [];

            if (array_key_first($firstRow) !== 'Name') {
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

        return new MigrationSourceAnalysis($migrationGroups, $emptyTypes);
    }

    protected function getGroupName(string $tableName): string
    {
        [$name] = explode('_', $tableName, 2);

        return StrInflector::toSingular(strtolower($name));
    }
}

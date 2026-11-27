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
     * @return  \Generator<int, TableDefinition>
     */
    protected function iterateTables(ExcelImporter $excel): \Generator
    {
        /** @var string $sheet */
        foreach ($excel->getSheetsIterator(true) as $sheet => $rows) {
            if (!$this->isTableName($sheet)) {
                continue;
            }

            $rows = iterator_to_array($rows);
            $firstRow = $rows[array_key_first($rows)] ?? [];

            if (array_key_first($firstRow) !== 'Name') {
                continue;
            }

            yield $this->buildTable($sheet, $rows);
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $rows
     */
    protected function buildTable(string $tableName, array $rows): TableDefinition
    {
        $columns = [];
        $indexes = [];
        $uniques = [];

        foreach ($rows as $row) {
            $name = trim((string) ($row['Name'] ?? ''));

            if ($name === '') {
                continue;
            }

            $key = strtolower(trim((string) ($row['Key'] ?? '')));
            $keyName = trim((string) ($row['Key Name'] ?? ''));
            $default = trim((string) ($row['Default'] ?? ''));
            $length = trim((string) ($row['Length'] ?? ''));

            $columns[] = new ColumnDefinition(
                name: $name,
                type: trim((string) ($row['Type'] ?? '')),
                length: $length !== '' ? $length : null,
                nullable: strtolower(trim((string) ($row['NULL'] ?? ''))) === 'allow',
                unsigned: strtolower(trim((string) ($row['Signed'] ?? ''))) === 'unsigned',
                default: $default !== '' ? $default : null,
                primary: $key === 'primary' || $key === 'primary (ai)',
                serial: $key === 'primary (ai)' || trim((string) ($row['Serial'] ?? '')) !== '',
                description: trim((string) ($row['Description'] ?? '')),
                note: trim((string) ($row['Note'] ?? '')),
            );

            // Columns sharing a Key Name form one composite key. Without a name, each column is its own key.
            if ($key === 'index' || $key === 'unique') {
                $keyName = $keyName !== '' ? $keyName : uniqid('', true);

                if ($key === 'index') {
                    $indexes[$keyName][] = $name;
                } else {
                    $uniques[$keyName][] = $name;
                }
            }
        }

        return new TableDefinition(
            name: $tableName,
            columns: $columns,
            indexes: array_values($indexes),
            uniques: array_values($uniques),
        );
    }
}

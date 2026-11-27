<?php

declare(strict_types=1);

namespace Unicorn\Test\Migration;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Migration\ExcelMigrationSource;
use Unicorn\Migration\TableDefinition;

class ExcelMigrationSourceTest extends TestCase
{
    #[Test]
    public function buildTableConvertsRowsToDefinitions(): void
    {
        $rows = [
            ['Name' => 'id', 'Type' => 'int', 'Key' => 'Primary (AI)', 'Signed' => 'unsigned'],
            ['Name' => 'a', 'Type' => 'varchar', 'Length' => '255', 'NULL' => 'allow', 'Key' => 'Index', 'Key Name' => 'k'],
            ['Name' => 'b', 'Type' => 'int', 'Default' => '0', 'Key' => 'Index', 'Key Name' => 'k'],
            ['Name' => 'c', 'Type' => 'int', 'Key' => 'Unique', 'Description' => 'C', 'Note' => 'enum:Foo'],
            ['Name' => '', 'Type' => 'int'],
        ];

        $method = new \ReflectionMethod(ExcelMigrationSource::class, 'buildTable');
        $table = $method->invoke(new ExcelMigrationSource(), 'articles', $rows);

        self::assertInstanceOf(TableDefinition::class, $table);
        self::assertCount(4, $table->columns);
        self::assertSame([true, true, true], [$table->columns[0]->primary, $table->columns[0]->serial, $table->columns[0]->unsigned]);
        self::assertSame(['255', true], [$table->columns[1]->length, $table->columns[1]->nullable]);
        self::assertSame('0', $table->columns[2]->default);
        self::assertSame('C - enum:Foo', $table->columns[3]->getComment());
        self::assertSame([['a', 'b']], $table->indexes);
        self::assertSame([['c']], $table->uniques);
    }
}

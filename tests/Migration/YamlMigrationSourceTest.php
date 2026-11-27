<?php

declare(strict_types=1);

namespace Unicorn\Test\Migration;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Migration\YamlMigrationSource;

class YamlMigrationSourceTest extends TestCase
{
    private string $file;

    protected function setUp(): void
    {
        $this->file = sys_get_temp_dir() . '/unicorn-mig-' . uniqid('', true) . '.yml';
    }

    protected function tearDown(): void
    {
        @unlink($this->file);
    }

    #[Test]
    public function analyzeGroupsTablesAndDetectsEmptyTypes(): void
    {
        file_put_contents(
            $this->file,
            <<<YAML
            articles:
              description: Articles
              columns:
                id:
                  type: int
                  primary: true
                  serial: true
                title:
                  Type: varchar
                  length: 255
                state:
              keys:
                index:
                  - title
            article_tags:
              columns:
                id: int
            Sample:
              columns:
                x: int
            _hidden:
              columns:
                x: int
            中文:
              columns:
                x: int
            YAML
        );

        $analysis = new YamlMigrationSource()->analyze($this->file);

        self::assertSame(['article'], array_keys($analysis->migrationGroups));
        self::assertSame(['articles', 'article_tags'], array_keys($analysis->migrationGroups['article']));

        $title = $analysis->migrationGroups['article']['articles'][1];

        self::assertSame('title', $title['Name']);
        self::assertSame('255', $title['Length']);
        self::assertSame([['title']], $analysis->tableKeys['articles']['index']);
        self::assertSame(['articles' => ['state']], $analysis->emptyTypes);
    }

    #[Test]
    public function analyzeMapsPrimaryAndSerial(): void
    {
        file_put_contents(
            $this->file,
            <<<YAML
            t:
              columns:
                a: { type: int, primary: true, serial: true }
                b: { type: char, primary: true }
                c: { type: int, serial: true }
            YAML
        );

        $rows = new YamlMigrationSource()->analyze($this->file)->migrationGroups['t']['t'];

        self::assertSame('Primary (AI)', $rows[0]['Key']);
        self::assertSame('Primary', $rows[1]['Key']);
        self::assertArrayNotHasKey('Key', $rows[2]);
        self::assertSame('true', $rows[2]['Serial']);
    }

    #[Test]
    public function analyzeBuildsCompositeUniqueKey(): void
    {
        file_put_contents(
            $this->file,
            <<<YAML
            maps:
              columns:
                a: int
                b: int
              keys:
                primary: a
                unique:
                  - [a, b]
                index: [b(10)]
            YAML
        );

        $analysis = new YamlMigrationSource()->analyze($this->file);

        $keys = $analysis->tableKeys['maps'];

        self::assertSame(['a'], $keys['primary']);
        self::assertSame([['a', 'b']], $keys['unique']);
        self::assertSame([['b(10)']], $keys['index']);
    }

    #[Test]
    public function enumIsAppendedToNote(): void
    {
        file_put_contents(
            $this->file,
            "t:\n  columns:\n    a:\n      type: int\n      enum: Foo\n    b:\n      type: int\n      note: hi\n      enum: Bar\n"
        );

        $rows = new YamlMigrationSource()->analyze($this->file)->migrationGroups['t']['t'];

        self::assertSame('enum:Foo', $rows[0]['Note']);
        self::assertSame('hi enum:Bar', $rows[1]['Note']);
    }

    #[Test]
    public function typeCanCarryLength(): void
    {
        file_put_contents($this->file, "t:\n  columns:\n    a: varchar(255)\n    b: decimal(20, 4)\n");

        $rows = new YamlMigrationSource()->analyze($this->file)->migrationGroups['t']['t'];

        self::assertSame(['varchar', '255'], [$rows[0]['Type'], $rows[0]['Length']]);
        self::assertSame(['decimal', '20,4'], [$rows[1]['Type'], $rows[1]['Length']]);
    }

    #[Test]
    public function analyzeParsesTemplate(): void
    {
        $analysis = new YamlMigrationSource()->analyze(__DIR__ . '/../../resources/tmpl/schema.yml');

        self::assertSame([], $analysis->emptyTypes);
        self::assertSame(['article_tag_map'], array_slice(array_keys($analysis->migrationGroups['article']), 1));
    }

    #[Test]
    public function jsonSchemaIsValidAndMatchesTemplate(): void
    {
        $schema = json_decode(
            file_get_contents(__DIR__ . '/../../resources/tmpl/schema.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        self::assertSame(
            ['description', 'columns', 'keys'],
            array_keys($schema['definitions']['table']['properties'])
        );
        self::assertSame(
            ['type', 'length', 'nullable', 'signed', 'default', 'primary', 'serial', 'enum', 'description', 'note'],
            array_keys($schema['definitions']['column']['properties'])
        );
        self::assertSame(['primary', 'index', 'unique'], array_keys($schema['definitions']['keys']['properties']));
    }

    #[Test]
    #[DataProvider('invalidProvider')]
    public function analyzeRejectsInvalid(string $yaml): void
    {
        file_put_contents($this->file, $yaml);

        $this->expectException(\UnexpectedValueException::class);

        new YamlMigrationSource()->analyze($this->file);
    }

    public static function invalidProvider(): array
    {
        return [
            'old format without columns' => ["articles:\n  id: int\n"],
            'list columns' => ["articles:\n  columns:\n    - id\n"],
            'unknown column attr' => ["articles:\n  columns:\n    id:\n      foo: 1\n"],
            'unknown key attr' => ["articles:\n  columns:\n    id:\n      key: Index\n"],
            'nullable not bool' => ["articles:\n  columns:\n    id:\n      type: int\n      nullable: allow\n"],
            'type and length' => ["articles:\n  columns:\n    t:\n      type: varchar(255)\n      length: 100\n"],
            'enum not string' => ["articles:\n  columns:\n    s:\n      type: int\n      enum: [a]\n"],
            'primary not bool' => ["articles:\n  columns:\n    id:\n      primary: yes please\n"],
            'serial on varchar' => ["articles:\n  columns:\n    id:\n      type: varchar\n      serial: true\n"],
            'unknown key column' => ["articles:\n  columns:\n    id: int\n  keys:\n    index: x\n"],
            'bad key type' => ["articles:\n  columns:\n    id: int\n  keys:\n    foo: id\n"],
            'keys as list' => ["articles:\n  columns:\n    id: int\n  keys:\n    - id\n"],
            'primary conflict' => ["articles:\n  columns:\n    id:\n      type: int\n      primary: true\n  keys:\n    primary: id\n"],
            'primary prefix' => ["articles:\n  columns:\n    id: int\n  keys:\n    primary: id(10)\n"],
        ];
    }
}

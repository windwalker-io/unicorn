<?php

declare(strict_types=1);

namespace Unicorn\Test\Migration;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Migration\YamlMigrationSource;

class YamlMigrationSourceTest extends TestCase
{
    private string $file;

    protected function setUp(): void
    {
        $this->file = sys_get_temp_dir() . '/unicorn-mig-' . uniqid() . '.yml';
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
              id:
                type: int
                key: Primary (AI)
              title:
                Type: varchar
                length: 255
                key_name: idx_title
              state:
            article_tags:
              id: int
            Sample:
              x: int
            _hidden:
              x: int
            中文:
              x: int
            YAML
        );

        $analysis = new YamlMigrationSource()->analyze($this->file);

        self::assertSame(['article'], array_keys($analysis->migrationGroups));
        self::assertSame(['articles', 'article_tags'], array_keys($analysis->migrationGroups['article']));
        $title = $analysis->migrationGroups['article']['articles'][1];
        self::assertSame('255', $title['Length']);
        self::assertSame('idx_title', $title['Key Name']);
        self::assertSame('title', $title['Name']);
        self::assertSame(['articles' => ['state']], $analysis->emptyTypes);
    }

    #[Test]
    public function analyzeThrowsOnListColumns(): void
    {
        file_put_contents($this->file, "articles:\n  - id\n");

        $this->expectException(\UnexpectedValueException::class);

        new YamlMigrationSource()->analyze($this->file);
    }
}

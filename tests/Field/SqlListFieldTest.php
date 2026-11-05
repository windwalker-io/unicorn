<?php

declare(strict_types=1);

namespace Unicorn\Tests\Field;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Field\SqlListField;

final class SqlListFieldTest extends TestCase
{
    use FieldTestTrait;

    #[Test]
    #[DataProvider('indentLevels')]
    public function prefixesOptionTextByIndentLevel(array $item, string $expectedText): void
    {
        $field = static::createField(SqlListField::class);

        $option = $field->createItemOption((object) ($item + ['id' => 7, 'title' => 'Foo']));

        self::assertSame('7', (string) $option->getAttribute('value'));
        self::assertSame($expectedText, trim($option->textContent));
    }

    public static function indentLevels(): array
    {
        return [
            'no level' => [[], 'Foo'],
            'level 1 is root' => [['level' => 1], 'Foo'],
            'level 3' => [['level' => 3], '- - Foo'],
            'zero or negative' => [['level' => -2], 'Foo'],
        ];
    }

    #[Test]
    public function usesCustomIndentField(): void
    {
        $field = static::createField(SqlListField::class);
        $field->indentByField('depth');

        $option = $field->createItemOption((object) ['id' => 1, 'title' => 'Foo', 'depth' => 2]);

        self::assertSame('- Foo', trim($option->textContent));
    }
}

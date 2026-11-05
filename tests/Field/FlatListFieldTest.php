<?php

declare(strict_types=1);

namespace Unicorn\Tests\Field;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Field\FlatListField;

final class FlatListFieldTest extends TestCase
{
    use FieldTestTrait;

    private static function option(FlatListField $field, int $id): \Windwalker\DOM\HTMLElement
    {
        return $field->createItemOption((object) ['id' => $id, 'title' => "Item {$id}"]);
    }

    #[Test]
    #[DataProvider('selectedValues')]
    public function normalizesValuesToSelection(mixed $value, array $checkedIds): void
    {
        $field = static::createField(FlatListField::class);
        $field->setValue($value);

        $checked = [];

        foreach ([1, 2, 3] as $id) {
            if (self::option($field, $id)->hasAttribute('checked')) {
                $checked[] = $id;
            }
        }

        self::assertSame($checkedIds, $checked);
    }

    public static function selectedValues(): array
    {
        return [
            'scalar' => ['2', [2]],
            'comma string' => ['1,3', [1, 3]],
            'json array' => ['[1,2]', [1, 2]],
            'empty' => ['', []],
            'null' => [null, []],
        ];
    }

    #[Test]
    public function defaultsToRadioAndSwitchesToCheckboxWhenMultiple(): void
    {
        $field = static::createField(FlatListField::class);

        self::assertSame('radio', self::option($field, 1)->getAttribute('type'));

        $field->multiple(true);

        self::assertSame('checkbox', self::option($field, 1)->getAttribute('type'));
    }

    #[Test]
    public function explicitInputTypeWinsAndAttributesAreSet(): void
    {
        $field = static::createField(FlatListField::class);
        $field->inputType('checkbox');

        $option = self::option($field, 5);

        self::assertSame('checkbox', $option->getAttribute('type'));
        self::assertSame('5', (string) $option->getAttribute('value'));
        self::assertSame('Item 5', $option->getAttribute('data-label'));
        self::assertStringEndsWith('[]', $option->getAttribute('name'));
    }
}

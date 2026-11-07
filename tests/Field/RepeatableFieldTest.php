<?php

declare(strict_types=1);

namespace Unicorn\Tests\Field;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Field\RepeatableField;
use Windwalker\Form\Field\ListField;
use Windwalker\Form\Field\TextField;
use Windwalker\Form\Form;

final class RepeatableFieldTest extends TestCase
{
    use FieldTestTrait;

    private static function createRepeatable(callable $configure): RepeatableField
    {
        $field = static::createField(RepeatableField::class, 'items');

        $field->configureForm(function (Form $form) use ($configure) {
            $configure($form);
        });

        return $field;
    }

    #[Test]
    public function prepareFormBindsDynamicNameAndPlainFlagForSingleFields(): void
    {
        $field = static::createRepeatable(function (Form $form) {
            $form->add('title', TextField::class);
        });

        $title = $field->prepareForm()->getField('title');

        self::assertSame("getName(i, item, 'title', false)", $title->getAttribute(':name'));
        self::assertSame("getId(i, item, 'title')", $title->getAttribute(':id'));
        self::assertSame('item.title', $title->getAttribute('x-model'));
    }

    #[Test]
    public function prepareFormPassesMultipleFlagForMultipleFields(): void
    {
        $field = static::createRepeatable(function (Form $form) {
            $form->add('title', TextField::class);
            $form->add('tags', ListField::class)->multiple(true);
        });

        $subForm = $field->prepareForm();

        self::assertSame(
            "getName(i, item, 'tags', true)",
            $subForm->getField('tags')->getAttribute(':name')
        );
        self::assertSame(
            "getName(i, item, 'title', false)",
            $subForm->getField('title')->getAttribute(':name')
        );
    }

    #[Test]
    public function singleArrayModeRequiresValueField(): void
    {
        $field = static::createRepeatable(function (Form $form) {
            $form->add('foo', TextField::class);
        });
        $field->singleArray(true);

        $this->expectException(\UnexpectedValueException::class);

        $field->prepareForm();
    }

    #[Test]
    public function singleArrayModeRejectsMoreThanTwoFields(): void
    {
        $field = static::createRepeatable(function (Form $form) {
            $form->add('key', TextField::class);
            $form->add('value', TextField::class);
            $form->add('extra', TextField::class);
        });
        $field->singleArray(true);

        $this->expectException(\UnexpectedValueException::class);

        $field->prepareForm();
    }

    #[Test]
    public function prepareJSDataParsesJsonValue(): void
    {
        $field = static::createRepeatable(function (Form $form) {
            $form->add('title', TextField::class)->defaultValue('x');
        });
        $field->setValue('{"a":{"title":"A"},"b":{"title":"B"}}');

        $data = $field->prepareJSData();

        self::assertSame([['title' => 'A'], ['title' => 'B']], $data['items']);
        self::assertSame(['title' => 'x'], $data['defaultValues']);
    }

    #[Test]
    public function prepareJSDataParsesCommaStringAsSingleArray(): void
    {
        $field = static::createRepeatable(function (Form $form) {
            $form->add('value', TextField::class);
        });
        $field->singleArray(true);
        $field->setValue('a, b');

        $data = $field->prepareJSData();

        self::assertSame([['value' => 'a'], ['value' => 'b']], $data['items']);
    }

    #[Test]
    public function prepareJSDataAddsKeyInSingleArrayModeWithKeyField(): void
    {
        $field = static::createRepeatable(function (Form $form) {
            $form->add('key', TextField::class);
            $form->add('value', TextField::class);
        });
        $field->singleArray(true);
        $field->setValue(['foo' => 'bar']);

        $data = $field->prepareJSData();

        self::assertSame([['value' => 'bar', 'key' => 'foo']], $data['items']);
    }

    #[Test]
    public function rendersStoreElementAndMultipleBindingInLayouts(): void
    {
        foreach ([
            RepeatableField::LAYOUT_TABLE,
            RepeatableField::LAYOUT_FLEX,
            RepeatableField::LAYOUT_GRID,
        ] as $layout) {
            $field = static::createRepeatable(function (Form $form) {
                $form->add('title', TextField::class);
                $form->add('tags', ListField::class)->multiple(true);
            });
            $field->layout($layout);
            $field->setValue([['title' => 'A', 'tags' => ['1', '2']]]);

            $html = $field->renderInput();

            self::assertSame(
                1,
                static::query($html, '//*[@data-repeatable-store]')->length,
                $layout
            );
            $decoded = html_entity_decode($html, ENT_QUOTES);

            self::assertStringContainsString("getName(i, item, 'tags', true)", $decoded, $layout);
            self::assertStringContainsString("getName(i, item, 'title', false)", $decoded, $layout);
        }
    }
}

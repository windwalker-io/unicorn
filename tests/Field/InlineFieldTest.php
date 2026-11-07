<?php

declare(strict_types=1);

namespace Unicorn\Tests\Field;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Field\InlineField;
use Windwalker\Form\Field\TextField;
use Windwalker\Form\Form;

final class InlineFieldTest extends TestCase
{
    use FieldTestTrait;

    private static function createInline(callable $configure): InlineField
    {
        $field = static::createField(InlineField::class, 'inline');

        $field->configureForm(function (Form $form) use ($configure) {
            $configure($form);
        });

        return $field;
    }

    #[Test]
    public function readonlyPropagatesToSubFields(): void
    {
        $field = static::createInline(function (Form $form) {
            $form->add('a', TextField::class);
            $form->add('b', TextField::class);
        });

        $field->readonly(true);

        foreach ($field->prepareForm()->getFields() as $sub) {
            self::assertTrue((bool) $sub->isReadonly(), $sub->getName());
        }
    }

    #[Test]
    public function disabledPropagatesToSubFields(): void
    {
        $field = static::createInline(function (Form $form) {
            $form->add('a', TextField::class);
            $form->add('b', TextField::class);
        });

        $field->disabled(true);

        foreach ($field->prepareForm()->getFields() as $sub) {
            self::assertTrue((bool) $sub->isDisabled(), $sub->getName());
        }
    }

    #[Test]
    public function subFieldReadonlyIsKeptWhenInlineIsNotReadonly(): void
    {
        $field = static::createInline(function (Form $form) {
            $form->add('a', TextField::class)->readonly(true);
            $form->add('b', TextField::class);
        });

        $form = $field->prepareForm();

        self::assertTrue((bool) $form->getField('a')->isReadonly());
        self::assertFalse((bool) $form->getField('b')->isReadonly());
    }
}

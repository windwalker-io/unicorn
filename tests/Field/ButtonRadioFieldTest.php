<?php

declare(strict_types=1);

namespace Unicorn\Tests\Field;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Field\ButtonRadioField;

final class ButtonRadioFieldTest extends TestCase
{
    use FieldTestTrait;

    #[Test]
    public function rendersButtonAndRadioPerOption(): void
    {
        $field = static::createField(ButtonRadioField::class);
        $field->option('One', '1');
        $field->option('Two', '2');
        $field->setValue('2');

        $html = $field->renderInput();

        self::assertSame(2, static::query($html, '//button[@data-value]')->length);
        self::assertSame(2, static::query($html, '//input[@type="radio"][@name="foo"]')->length);
        self::assertSame(1, static::query($html, '//input[@type="radio"][@value="2"][@checked]')->length);
        self::assertSame(0, static::query($html, '//input[@type="radio"][@value="1"][@checked]')->length);
    }

    #[Test]
    public function marksRadiosDisabled(): void
    {
        $field = static::createField(ButtonRadioField::class);
        $field->option('One', '1');
        $field->disabled(true);

        $html = $field->renderInput();

        self::assertSame(1, static::query($html, '//input[@type="radio"][@disabled]')->length);
    }
}

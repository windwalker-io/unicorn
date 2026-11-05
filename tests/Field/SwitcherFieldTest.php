<?php

declare(strict_types=1);

namespace Unicorn\Tests\Field;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Field\SwitcherField;

final class SwitcherFieldTest extends TestCase
{
    use FieldTestTrait;

    #[Test]
    public function rendersHiddenFallbackAndCheckbox(): void
    {
        $field = static::createField(SwitcherField::class);

        $html = $field->renderInput();

        self::assertSame(1, static::query($html, '//input[@type="hidden"][@value="0"]')->length);
        self::assertSame(1, static::query($html, '//input[@type="checkbox"][@value="1"]')->length);
        self::assertSame(0, static::query($html, '//input[@type="checkbox"][@checked]')->length);
    }

    #[Test]
    public function checksWhenValueMatchesCheckedValue(): void
    {
        $field = static::createField(SwitcherField::class);
        $field->checkedValue('yes');
        $field->uncheckedValue('no');
        $field->setValue('yes');

        $html = $field->renderInput();

        self::assertSame(1, static::query($html, '//input[@type="checkbox"][@value="yes"][@checked]')->length);
        self::assertSame(1, static::query($html, '//input[@type="hidden"][@value="no"]')->length);
    }

    #[Test]
    public function staysUncheckedWhenValueDiffers(): void
    {
        $field = static::createField(SwitcherField::class);
        $field->checkedValue('yes');
        $field->setValue('no');

        $html = $field->renderInput();

        self::assertSame(0, static::query($html, '//input[@type="checkbox"][@checked]')->length);
    }

    #[Test]
    public function appliesShapeSizeAndColorClasses(): void
    {
        $field = static::createField(SwitcherField::class);
        $field->circle()->size('lg')->color('primary');

        $html = $field->renderInput();

        self::assertSame(1, static::query($html, '//label[contains(@class,"switch-lg")]')->length);
        self::assertSame(
            1,
            static::query($html, '//span[contains(@class,"slider-circle")][contains(@class,"btn-primary")]')->length
        );
    }
}

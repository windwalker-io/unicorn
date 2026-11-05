<?php

declare(strict_types=1);

namespace Unicorn\Tests\Html\State;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Html\State\StateOption;

/**
 * @covers \Unicorn\Html\State\StateOption
 */
final class StateOptionTest extends TestCase
{
    #[Test]
    public function defaults(): void
    {
        $option = new StateOption('1');

        self::assertSame('1', $option->getValue());
        self::assertSame('fa fa-fw fa-question-circle', $option->getIcon());
        self::assertSame('dark', $option->getColor());
        self::assertSame('Unknown state', $option->getTitle());
        self::assertSame('btn btn-light', $option->getButtonClass());
        self::assertSame('', $option->getDescription());
        self::assertSame('', $option->getText());
        self::assertSame('', $option->getTextColor());
        self::assertFalse($option->isDisabled());
        self::assertFalse($option->isOnlyIcon());
    }

    #[Test]
    public function constructorAppliesOptions(): void
    {
        $option = new StateOption(
            'pub',
            [
                'icon' => 'fa fa-check',
                'color' => 'success',
                'title' => 'Published',
                'description' => 'Desc',
                'buttonClass' => 'btn-success',
                'text' => 'Pub',
                'textColor' => 'white',
                'disabled' => true,
                'onlyIcon' => true,
            ]
        );

        self::assertSame('pub', $option->getValue());
        self::assertSame('fa fa-check', $option->getIcon());
        self::assertSame('success', $option->getColor());
        self::assertSame('Published', $option->getTitle());
        self::assertSame('Desc', $option->getDescription());
        self::assertSame('btn-success', $option->getButtonClass());
        self::assertSame('Pub', $option->getText());
        self::assertSame('white', $option->getTextColor());
        self::assertTrue($option->isDisabled());
        self::assertTrue($option->isOnlyIcon());
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Tests\Html\State;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Unicorn\Html\State\StateButton;
use Unicorn\Html\State\StateOption;
use Windwalker\Utilities\Enum\EnumMetaInterface;

/**
 * @covers \Unicorn\Html\State\StateButton
 */
final class StateButtonTest extends TestCase
{
    #[Test]
    public function addStateAndGetState(): void
    {
        $button = StateButton::create();
        $state = $button->addState(1);

        self::assertInstanceOf(StateOption::class, $state);
        self::assertSame('1', $state->getValue());
        self::assertSame($state, $button->getState(1));
        self::assertSame($state, $button->getState('1'));
    }

    #[Test]
    public function getStateReturnsNullWhenMissing(): void
    {
        $button = StateButton::create();

        self::assertNull($button->getState('nope'));
    }

    #[Test]
    public function normalizeBooleanValues(): void
    {
        $button = StateButton::create();

        self::assertSame('1', $button->addState(true)->getValue());
        self::assertSame('0', $button->addState(false)->getValue());
    }

    #[Test]
    public function addStateWithEnumCopiesMeta(): void
    {
        $button = StateButton::create();
        $state = $button->addState(TestState::Pub);

        self::assertSame('pub', $state->getValue());
        self::assertSame('Published', $state->getTitle());
        self::assertSame('fa fa-check', $state->getIcon());
    }

    #[Test]
    public function fromEnumAddsAllCases(): void
    {
        $button = StateButton::fromEnum(TestState::class);

        self::assertNotNull($button->getState('pub'));
        self::assertNotNull($button->getState('unpub'));
        self::assertCount(2, $button->getCompiledStates());
    }

    #[Test]
    public function getCompiledStateMergesButtonOptions(): void
    {
        $button = StateButton::create(['buttonClass' => 'btn-custom']);
        $button->addState('1', null);

        $compiled = $button->getCompiledState('1');

        self::assertNotSame($button->getState('1'), $compiled);
        self::assertSame('btn-custom', $compiled->getButtonClass());
    }

    #[Test]
    public function getCompiledStateThrowsWhenMissing(): void
    {
        $button = StateButton::create();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage("State with value 'missing' not found.");

        $button->getCompiledState('missing');
    }

    #[Test]
    public function removeState(): void
    {
        $button = StateButton::create();
        $button->addState('1');
        $button->addState('0');

        $button->removeState('1');

        self::assertNull($button->getState('1'));
        self::assertNotNull($button->getState('0'));
    }
}

enum TestState: string implements EnumMetaInterface
{
    case Pub = 'pub';
    case Unpub = 'unpub';

    public function getTitle(?\Windwalker\Utilities\Contract\LanguageInterface $lang = null, ...$args): string
    {
        return match ($this) {
            self::Pub => 'Published',
            self::Unpub => 'Unpublished',
        };
    }

    public static function getTitles(): array
    {
        return [];
    }

    public static function fromTitle(string $title): self
    {
        return self::Pub;
    }

    public static function tryFromTitle(string $title): ?self
    {
        return null;
    }

    public function getIcon(): string
    {
        return 'fa fa-check';
    }

    public static function getIcons(): array
    {
        return [];
    }

    public function getColor(): string
    {
        return 'success';
    }

    public static function getColors(): array
    {
        return [];
    }

    public function getMeta(): array
    {
        return [];
    }

    public static function getMetas(): array
    {
        return [];
    }

    public static function maxLength(): int
    {
        return 10;
    }

    public function isHidden(): bool
    {
        return false;
    }
}

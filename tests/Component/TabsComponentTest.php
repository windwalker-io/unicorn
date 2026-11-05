<?php

declare(strict_types=1);

namespace Unicorn\Tests\Component;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Component\TabsComponent;

final class TabsComponentTest extends TestCase
{
    use ComponentTestTrait;

    #[Test]
    public function encodesDirectiveOptionsAndMapsKeepActiveTrueToFormSelector(): void
    {
        $component = new TabsComponent();
        $component->id = 'settings-tabs';
        $component->variant = 'pills';
        $component->keepactive = true;
        $component->fill = true;
        $component->navTarget = '#settings-nav';
        $component->navClass = 'nav-compact';
        $component->navAttrs = ['aria-label' => 'Settings'];
        $component->navGap = 2;
        $component->disabled = false;

        $attributes = $component->data()['attributes'];
        $options = json_decode($attributes['uni-tabs-autonav'], true, flags: JSON_THROW_ON_ERROR);

        self::assertSame('settings-tabs', $attributes['id']);
        self::assertSame('pills', $options['variant']);
        self::assertSame('#admin-form', $options['keepactive']);
        self::assertTrue($options['fill']);
        self::assertSame('#settings-nav', $options['nav-target']);
        self::assertSame('nav-compact', $options['nav-class']);
        self::assertSame(['aria-label' => 'Settings'], $options['nav-attrs']);
        self::assertSame(2, $options['gap']);
        self::assertFalse($options['disabled']);
    }

    #[Test]
    public function resolvesTheTabsView(): void
    {
        self::assertSame('@tabs', new TabsComponent()->render());
    }

    #[Test]
    public function rendersTabsContainerWithAutonavDirectiveAndSlotContent(): void
    {
        $component = new TabsComponent();
        $component->id = 'settings-tabs';
        $component->variant = 'pills';
        $component->navClass = 'nav-compact';

        $html = static::renderComponent($component, ['slot' => '<div data-role="tab-pane">Pane</div>']);

        self::assertStringContainsString('id="settings-tabs"', $html);
        self::assertStringContainsString('class="tab-content"', $html);
        self::assertStringContainsString('uni-tabs-autonav=', $html);
        self::assertStringContainsString('&quot;variant&quot;:&quot;pills&quot;', $html);
        self::assertStringContainsString('<div data-role="tab-pane">Pane</div>', $html);
    }

}

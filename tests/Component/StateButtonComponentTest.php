<?php

declare(strict_types=1);

namespace Unicorn\Tests\Component;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Component\StateButtonComponent;
use Unicorn\Workflow\WorkflowController;

final class StateButtonComponentTest extends TestCase
{
    use ComponentTestTrait;

    #[Test]
    public function buildsStateFromArrayAndMergesOptions(): void
    {
        $component = new StateButtonComponent();
        $component->value = 'draft';
        $component->states = [
            'draft' => ['title' => 'Draft', 'color' => 'secondary'],
        ];
        $component->options = ['title' => 'Saved draft', 'color' => 'primary'];

        $data = $component->data();

        self::assertSame('draft', $data['state']->getValue());
        self::assertSame('Saved draft', $data['state']->getTitle());
        self::assertSame('primary', $data['state']->getColor());
        self::assertSame('text-primary', $data['color']);
    }

    #[Test]
    public function normalizesBooleanValuesAndCompilesWorkflowStates(): void
    {
        $controller = new WorkflowController('status');
        $controller->addState('1')->color('success')->title('Published');

        $component = new StateButtonComponent();
        $component->value = true;
        $component->states = $controller;

        $data = $component->data();

        self::assertSame('1', $component->value);
        self::assertSame('1', $data['state']->getValue());
        self::assertSame('Published', $data['state']->getTitle());
        self::assertSame('text-success', $data['color']);
        self::assertSame('0', $component->normalizeValue(false));
    }

    #[Test]
    public function resolvesTheStateButtonView(): void
    {
        self::assertSame('@state-button', new StateButtonComponent()->render());
    }

    #[Test]
    public function rendersStateButtonWithCompiledColorAndTitle(): void
    {
        $controller = new WorkflowController('status');
        $controller->addState('draft')->color('secondary')->title('Draft');

        $component = new StateButtonComponent();
        $component->value = 'draft';
        $component->states = $controller;

        $html = static::renderComponent($component);

        self::assertStringContainsString('<button type="button"', $html);
        self::assertStringContainsString('c-state-button--draft', $html);
        self::assertStringContainsString('text-secondary', $html);
        self::assertStringContainsString('Draft', $html);
        self::assertStringNotContainsString('disabled', $html);
    }

    #[Test]
    public function rendersReadonlyStateAsIconSpanWithoutButton(): void
    {
        $controller = new WorkflowController('status');
        $controller->addState('1')->color('success')->title('Published');

        $component = new StateButtonComponent();
        $component->value = '1';
        $component->states = $controller;
        $component->readonly = true;

        $html = static::renderComponent($component);

        self::assertStringContainsString('c-state-button--icon', $html);
        self::assertStringContainsString('text-success', $html);
        self::assertStringNotContainsString('<button', $html);
    }

}

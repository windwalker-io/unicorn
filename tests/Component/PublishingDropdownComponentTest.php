<?php

declare(strict_types=1);

namespace Unicorn\Tests\Component;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Component\PublishingDropdownComponent;
use Unicorn\Workflow\State;
use Unicorn\Workflow\WorkflowController;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;

final class PublishingDropdownComponentTest extends TestCase
{
    #[Test]
    public function addsFutureScheduleTooltipWithoutMutatingWorkflowState(): void
    {
        $state = new State('1')->title('Published')->color('success');
        $workflow = new WorkflowController('status');
        $workflow->addState($state);

        $component = new PublishingDropdownComponent();
        $component->workflow = $workflow;
        $component->value = '1';
        $component->publishUp = new \DateTimeImmutable('+2 days');
        $component->publishDown = new \DateTimeImmutable('+5 days');

        $lang = $this->createStub(LangService::class);
        $lang->method('trans')->willReturnCallback(
            static fn(string $id, ...$args): string => $id . ($args['time'] ?? '')
        );
        $this->setComponentProperty($component, 'lang', $lang);

        $chronos = $this->createMock(ChronosService::class);
        $chronos->expects($this->exactly(2))
            ->method('toLocalFormat')
            ->willReturnCallback(static fn(\DateTimeInterface $date, string $format): string => $date->format($format));
        $this->setComponentProperty($component, 'chronosService', $chronos);

        $data = $component->data();

        self::assertSame('Published', $state->getTitle());
        self::assertSame(' fa fa-clock', $data['currentState']->getIcon());
        self::assertSame('text-warning', $data['textColor']);
        self::assertSame('tooltip', $data['attributes']['data-bs-toggle']);
        self::assertStringContainsString('unicorn.publishing.dropdown.waiting.publish', $data['attributes']['title']);
        self::assertStringContainsString($component->publishUp->format('Y/m/d H:i:s'), $data['attributes']['title']);
        self::assertStringContainsString($component->publishDown->format('Y/m/d H:i:s'), $data['attributes']['title']);
    }

    #[Test]
    public function marksPastPublishDownAsStoppedAndSkipsUnpublishedTooltip(): void
    {
        $workflow = new WorkflowController('status');
        $workflow->addState(new State('1')->title('Published')->color('success'));

        $component = new PublishingDropdownComponent();
        $component->workflow = $workflow;
        $component->value = '1';
        $component->publishDown = new \DateTimeImmutable('-1 day');

        $lang = $this->createStub(LangService::class);
        $lang->method('trans')->willReturnCallback(static fn(string $id, mixed ...$args): string => $id);
        $this->setComponentProperty($component, 'lang', $lang);

        $chronos = $this->createMock(ChronosService::class);
        $chronos->expects($this->once())
            ->method('toLocalFormat')
            ->willReturnCallback(static fn(\DateTimeInterface $date, string $format): string => $date->format($format));
        $this->setComponentProperty($component, 'chronosService', $chronos);

        $data = $component->data();

        self::assertSame(' fa fa-stop', $data['currentState']->getIcon());
        self::assertSame('text-secondary', $data['textColor']);
        self::assertSame('unicorn.publishing.dropdown.publish.down', $data['currentState']->getTitle());
        self::assertStringContainsString(
            'unicorn.publishing.dropdown.publish.down.time',
            $data['attributes']['title']
        );
    }

    #[Test]
    public function usesPublishUpTooltipWhenOnlyPublishUpIsSetAndDateIsPast(): void
    {
        $workflow = new WorkflowController('status');
        $workflow->addState(new State('1')->title('Published')->color('success'));

        $component = new PublishingDropdownComponent();
        $component->workflow = $workflow;
        $component->value = '1';
        $component->publishUp = new \DateTimeImmutable('-1 day');

        $lang = $this->createStub(LangService::class);
        $lang->method('trans')->willReturnCallback(static fn(string $id, mixed ...$args): string => $id);
        $this->setComponentProperty($component, 'lang', $lang);

        $chronos = $this->createMock(ChronosService::class);
        $chronos->expects($this->once())
            ->method('toLocalFormat')
            ->willReturnCallback(static fn(\DateTimeInterface $date, string $format): string => $date->format($format));
        $this->setComponentProperty($component, 'chronosService', $chronos);

        $data = $component->data();

        self::assertSame(' fa fa-play', $data['currentState']->getIcon());
        self::assertStringContainsString('unicorn.publishing.dropdown.publish.up', $data['attributes']['title']);
        self::assertStringNotContainsString('publish.down', $data['attributes']['title']);
    }

    #[Test]
    public function leavesStateUntouchedWhenNoScheduleIsSet(): void
    {
        $state = new State('1')->title('Published')->color('success');
        $workflow = new WorkflowController('status');
        $workflow->addState($state);

        $component = new PublishingDropdownComponent();
        $component->workflow = $workflow;
        $component->value = '1';

        $data = $component->data();

        self::assertSame('Published', $data['currentState']->getTitle());
        self::assertNull($data['textColor']);
        self::assertArrayNotHasKey('title', $data['attributes'] ?? []);
    }

    #[Test]
    public function mergesAttributesWithoutTouchingTooltipForUnpublishedValue(): void
    {
        $workflow = new WorkflowController('status');
        $workflow->addState(new State('0')->title('Unpublished'));

        $component = new PublishingDropdownComponent();
        $component->workflow = $workflow;
        $component->value = '0';
        $component->publishUp = new \DateTimeImmutable('+1 day');

        $component->withAttributes(['class' => 'a'])->withAttributes(['id' => 'b']);

        $data = $component->data();

        self::assertSame('Unpublished', $data['currentState']->getTitle());
        self::assertSame(['class' => 'a', 'id' => 'b'], $component->attributes->getAttributes());
        self::assertArrayNotHasKey('data-bs-toggle', $data['attributes'] ?? []);
    }

    #[Test]
    public function resolvesTheInheritedStateDropdownView(): void
    {
        self::assertSame('@state-dropdown', new PublishingDropdownComponent()->render());
    }

    private function setComponentProperty(object $component, string $property, object $value): void
    {
        $reflection = new \ReflectionProperty($component, $property);
        $reflection->setValue($component, $value);
    }
}

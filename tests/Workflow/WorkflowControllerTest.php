<?php

declare(strict_types=1);

namespace Unicorn\Tests\Workflow;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Enum\BasicState;
use Unicorn\Enum\PublishingState;
use Unicorn\Workflow\BasicStateWorkflow;
use Unicorn\Workflow\PublishingStateWorkflow;
use Unicorn\Workflow\State;
use Unicorn\Workflow\Transition;
use Unicorn\Workflow\WorkflowController;

class WorkflowControllerTest extends TestCase
{
    private function createController(bool $free = false): WorkflowController
    {
        $controller = new WorkflowController('state');
        $controller->registerStatesFromEnum(PublishingState::class);
        $controller->allowFreeTransitions($free);

        return $controller;
    }

    #[Test]
    public function registerStatesFromEnum(): void
    {
        $controller = $this->createController();

        self::assertEqualsCanonicalizing(['1', '0', '-2', '-1'], $controller->getStateValues());
        self::assertInstanceOf(State::class, $controller->getState(PublishingState::PUBLISHED));
        self::assertNull($controller->getState('999'));
    }

    #[Test]
    public function stateAndTransitionAccessors(): void
    {
        $state = new State('a', 'A');
        $state->title('B')->icon('i')->color('red')->setIsInitial(true);

        self::assertSame('B', $state->getTitle());
        self::assertSame('i', $state->getIcon());
        self::assertSame('red', $state->getColor());
        self::assertTrue($state->isInitial());

        $t = new Transition('go', ['a'], 'b');
        $t->button('icon', 'Title', 'Desc')->setEnabled(false);

        self::assertSame('go', $t->getName());
        self::assertSame('icon', $t->getIcon());
        self::assertSame('Title', $t->getTitle());
        self::assertSame('Desc', $t->getDescription());
        self::assertFalse($t->isEnabled());
    }

    #[Test]
    public function addTransitionRemovesToFromFromsAndStringifies(): void
    {
        $controller = $this->createController();

        $t = $controller->addTransition(
            'trash',
            [PublishingState::PUBLISHED, PublishingState::TRASHED],
            PublishingState::TRASHED
        );

        self::assertSame(['1'], array_values($t->getFroms()));
        self::assertSame('-2', $t->getTo());
        self::assertTrue($controller->isTransitionExists('trash'));
        self::assertFalse($controller->isTransitionExists('nope'));
    }

    #[Test]
    public function addTransitionWithNullFromsExpandsToAllStates(): void
    {
        $controller = $this->createController();

        $t = $controller->addTransition('reset', null, PublishingState::UNPUBLISHED);

        self::assertEqualsCanonicalizing(['1', '-2', '-1'], array_values($t->getFroms()));
    }

    #[Test]
    public function addTransitionRejectsArrayTo(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->createController()->addTransition('x', null, ['1', '0']);
    }

    #[Test]
    public function isAllowSameStateAlwaysTrue(): void
    {
        $controller = $this->createController();

        self::assertTrue($controller->isAllow('1', '1'));
        self::assertTrue($controller->isAllow(['1'], '1'));
    }

    #[Test]
    public function isAllowFreeTransitions(): void
    {
        $controller = $this->createController(true);

        self::assertTrue($controller->isAllow('1', '-2'));
        self::assertFalse($controller->isAllow('1', '999'));
        self::assertFalse($controller->isAllow('999', '1'));
    }

    #[Test]
    public function isAllowStrictTransitions(): void
    {
        $controller = $this->createController();
        $controller->addTransition('publish', PublishingState::UNPUBLISHED, PublishingState::PUBLISHED);

        self::assertTrue($controller->isAllow('0', '1'));
        self::assertFalse($controller->isAllow('1', '0'));
        self::assertFalse($controller->isAllow('-2', '1'));
        self::assertSame('publish', $controller->findTransition('0', '1')?->getName());
        self::assertNull($controller->findTransition('0', '-2'));
    }

    #[Test]
    public function enabledTransitionsAndAvailableStates(): void
    {
        $controller = $this->createController();
        $controller->addTransition('publish', PublishingState::UNPUBLISHED, PublishingState::PUBLISHED);
        $controller->addTransition('archive', PublishingState::UNPUBLISHED, PublishingState::ARCHIVED)
            ->setEnabled(false);
        $controller->addTransition('trash', PublishingState::PUBLISHED, PublishingState::TRASHED);

        $enabled = $controller->getEnabledTransitions('0');

        self::assertSame(['publish'], array_keys($enabled));
        self::assertEqualsCanonicalizing(['0', '1'], array_keys($controller->getAvailableStates('0')));
    }

    #[Test]
    public function initialStates(): void
    {
        $controller = $this->createController();
        $controller->setInitialStates([PublishingState::PUBLISHED]);

        self::assertSame(['1'], array_map('strval', array_keys($controller->getInitialStates())));
    }

    #[Test]
    public function stateTitlesAndMeta(): void
    {
        $controller = $this->createController();
        $controller->setStateTitles([1 => 'Pub']);
        $controller->setStateMeta(PublishingState::TRASHED, 'T', 'icon-t', 'warn');

        self::assertSame('Pub', $controller->getState('1')->getTitle());
        self::assertSame('T', $controller->getState('-2')->getTitle());
        self::assertSame('icon-t', $controller->getState('-2')->getIcon());
        self::assertSame('warn', $controller->getState('-2')->getColor());
    }

    #[Test]
    public function setTransitionsReplacesExisting(): void
    {
        $controller = $this->createController();
        $controller->addTransition('old', '0', '1');
        $controller->setTransitions([new Transition('new', ['0'], '1')]);

        self::assertSame(['new'], array_keys($controller->getTransitions()));
    }

    #[Test]
    public function triggerTransitionThrowsForUnknownName(): void
    {
        $this->expectException(\LogicException::class);

        $this->createController()->triggerBeforeTransition(
            'missing',
            $this->createStub(\Windwalker\ORM\Event\WatchEvent::class)
        );
    }

    #[Test]
    public function stateOptionsAndButton(): void
    {
        $controller = $this->createController();
        $controller->setStateTitles(['1' => 'A', '0' => 'B', '-2' => 'C', '-1' => 'D']);

        self::assertCount(4, $controller->getStateOptions());
        self::assertNotNull($controller->getStateButton());
    }

    #[Test]
    public function basicStateWorkflowPrepare(): void
    {
        $controller = new WorkflowController('state');
        $controller->registerStatesFromEnum(BasicState::class);
        $controller->allowFreeTransitions(false);

        new BasicStateWorkflow()->prepare($controller, null);

        self::assertSame(['publish', 'unpublish'], array_keys($controller->getTransitions()));
        self::assertSame('success', $controller->getState(BasicState::PUBLISHED)->getColor());
        self::assertSame('danger', $controller->getState(BasicState::UNPUBLISHED)->getColor());
        self::assertTrue($controller->isAllow('0', '1'));
        self::assertTrue($controller->isAllow('1', '0'));
    }

    #[Test]
    public function publishingStateWorkflowPrepare(): void
    {
        $controller = $this->createController();

        new PublishingStateWorkflow()->prepare($controller, null);

        self::assertEqualsCanonicalizing(
            ['publish', 'unpublish', 'archive', 'trash', 'untrash'],
            array_keys($controller->getTransitions())
        );
        self::assertEqualsCanonicalizing(['1', '0'], array_map('strval', array_keys($controller->getInitialStates())));
        self::assertTrue($controller->isAllow('0', '-1'));
        self::assertFalse($controller->isAllow('1', '-1'));
        self::assertTrue($controller->isAllow('-1', '-2'));
        self::assertFalse($controller->isAllow('-2', '1'));
        self::assertTrue($controller->isAllow('-2', '0'));
    }
}

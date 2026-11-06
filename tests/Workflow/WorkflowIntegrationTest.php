<?php

declare(strict_types=1);

namespace Unicorn\Tests\Workflow;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Attributes\StateMachine;
use Unicorn\Workflow\Exception\TransitionDisallowException;
use Unicorn\Workflow\TransitionEvent;
use Unicorn\Workflow\WorkflowController;
use Unicorn\Workflow\WorkflowInterface;
use Unicorn\Workflow\WorkflowTrait;
use Windwalker\Core\Testing\Traits\InMemoryDatabaseTestTrait;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\Core\Language\LangService;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\Event\WatchEvent;
use Windwalker\ORM\Metadata\EntityMetadata;

/**
 * Real ORM flow: workflow listens to an entity and guards / notifies on state changes.
 */
class WorkflowIntegrationTest extends TestCase
{
    use InMemoryDatabaseTestTrait;

    protected function prepareInMemoryDatabaseSchema(DatabaseAdapter $db): void
    {
        $db->execute(
            'CREATE TABLE wf_products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(255) NOT NULL,
                review_state VARCHAR(10) NOT NULL DEFAULT \'draft\'
            )',
        );

        WfProduct::$workflow = $this->createWorkflow();
        WfProduct::$log = [];
    }

    private function createWorkflow(): WfReviewWorkflow
    {
        $workflow = new WfReviewWorkflow();
        $workflow->setField('review_state');
        $workflow->setDefaultEnum(WfReviewState::class);
        $workflow->setStrict(true);

        $lang = $this->createStub(LangService::class);
        $lang->method('trans')->willReturn('disallowed');
        new \ReflectionProperty($workflow, 'lang')->setValue($workflow, $lang);

        return $workflow;
    }

    private function storedState(WfProduct $product): string
    {
        return (string) $this->db->execute(
            'SELECT review_state FROM wf_products WHERE id = ?',
            [$product->id]
        )->get()->review_state;
    }

    private function save(WfProduct $product): WfProduct
    {
        $orm = $this->db->orm();

        return $orm->mapper(WfProduct::class)->saveOne($product);
    }

    private function create(WfReviewState $state = WfReviewState::DRAFT): WfProduct
    {
        $product = new WfProduct();
        $product->title = 'P';
        $product->reviewState = $state;

        return $this->save($product);
    }

    #[Test]
    public function validTransitionChainIsAllowedAndEventsFire(): void
    {
        $product = $this->create();
        WfProduct::$log = [];

        foreach ([WfReviewState::PENDING, WfReviewState::APPROVED] as $state) {
            $product->reviewState = $state;
            $product = $this->save($product);
        }

        self::assertSame(
            [
                'before-changed:draft>pending',
                'after-transition:submit',
                'before-changed:pending>approved',
                'after-transition:approve',
            ],
            WfProduct::$log
        );
        self::assertSame(
            'approved',
            $this->storedState($product)
        );
    }

    #[Test]
    public function disallowedTransitionThrowsAndKeepsStoredState(): void
    {
        $product = $this->create();

        $product->reviewState = WfReviewState::APPROVED;

        try {
            $this->save($product);
            self::fail('Expected TransitionDisallowException');
        } catch (TransitionDisallowException $e) {
            self::assertSame('draft', $e->getForm());
            self::assertSame('approved', $e->getTo());
        }

        self::assertSame(
            'draft',
            $this->storedState($product)
        );
    }

    #[Test]
    public function rejectedCanBeResubmitted(): void
    {
        $product = $this->create(WfReviewState::DRAFT);

        foreach ([WfReviewState::PENDING, WfReviewState::REJECTED, WfReviewState::PENDING] as $state) {
            $product->reviewState = $state;
            $product = $this->save($product);
        }

        self::assertSame(WfReviewState::PENDING, $product->reviewState);
    }

    #[Test]
    public function freeModeAllowsAnyKnownState(): void
    {
        WfProduct::$workflow->setStrict(false);

        $product = $this->create();
        $product->reviewState = WfReviewState::APPROVED;
        $product = $this->save($product);

        self::assertSame(WfReviewState::APPROVED, $product->reviewState);
    }

    #[Test]
    public function compileUsesEntityAndOptions(): void
    {
        $workflow = $this->createWorkflow();
        $ctrl = $workflow->compile(new WfProduct(), null, ['foo' => 'bar']);

        self::assertSame('bar', $ctrl->getOption('foo'));
        self::assertSame('review_state', $ctrl->getField());
        self::assertSame(['draft', 'pending', 'approved', 'rejected'], $ctrl->getStateValues());
        self::assertSame(['submit', 'approve', 'reject'], array_keys($ctrl->getTransitions()));
        self::assertSame(['draft', 'approved'], array_keys($ctrl->getInitialStates()));
    }

    #[Test]
    public function compileWithoutFieldThrows(): void
    {
        $this->expectException(\LogicException::class);

        new WfReviewWorkflow()->compile();
    }

    #[Test]
    public function transitionEventIsEmittedWithTransitionInfo(): void
    {
        $ctrl = $this->createWorkflow()->compile(new WfProduct(), 'review_state');
        $captured = [];

        $ctrl->on(
            'before_transition__submit',
            function (TransitionEvent $event) use (&$captured): void {
                $captured = [$event->fromArray, $event->to, $event->transition?->getName()];
            }
        );

        $ctrl->triggerBeforeTransition('submit', new WatchEvent('watch'));

        self::assertSame([['draft', 'rejected'], 'pending', 'submit'], $captured);
    }

    #[Test]
    public function afterTransitionEventIsEmitted(): void
    {
        $ctrl = $this->createWorkflow()->compile(new WfProduct(), 'review_state');
        $called = 0;

        $ctrl->on('after_transition__approve', function () use (&$called): void {
            $called++;
        });

        $ctrl->triggerAfterTransition('approve', new WatchEvent('watch'));

        self::assertSame(1, $called);
    }

    #[Test]
    public function wildcardChangedListenerReceivesAllSources(): void
    {
        $ctrl = $this->createWorkflow()->compile(new WfProduct(), 'review_state');
        $seen = [];

        $ctrl->onAfterChanged('*', 'rejected', function (TransitionEvent $e) use (&$seen): void {
            $seen[] = $e->froms;
        });

        $ctrl->triggerAfterChanged('pending', 'rejected', new WatchEvent('watch'));
        $ctrl->triggerAfterChanged('draft', 'rejected', new WatchEvent('watch'));
        $ctrl->triggerAfterChanged('draft', 'pending', new WatchEvent('watch'));

        self::assertSame(['pending', 'draft'], $seen);
    }

    #[Test]
    public function onFromAndOnToHelpers(): void
    {
        $ctrl = $this->createWorkflow()->compile(new WfProduct(), 'review_state');
        $log = [];

        $ctrl->onBeforeFrom('pending', function (TransitionEvent $e) use (&$log): void {
            $log[] = "from:{$e->froms}>{$e->to}";
        });
        $ctrl->onAfterTo('approved', function (TransitionEvent $e) use (&$log): void {
            $log[] = "to:{$e->froms}>{$e->to}";
        });

        $ctrl->triggerBeforeChanged('pending', 'approved', new WatchEvent('watch'));
        $ctrl->triggerBeforeChanged('draft', 'approved', new WatchEvent('watch'));
        $ctrl->triggerAfterChanged('pending', 'approved', new WatchEvent('watch'));

        self::assertSame(['from:pending>approved', 'to:pending>approved'], $log);
    }
}

enum WfReviewState: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}

#[StateMachine(field: 'review_state', enum: WfReviewState::class, strict: true)]
class WfReviewWorkflow implements WorkflowInterface
{
    use WorkflowTrait;

    public function prepare(WorkflowController $workflow, ?object $entity): void
    {
        $workflow->setInitialStates([WfReviewState::DRAFT, WfReviewState::APPROVED]);

        $workflow->addTransition('submit', [WfReviewState::DRAFT, WfReviewState::REJECTED], WfReviewState::PENDING);
        $workflow->addTransition('approve', [WfReviewState::PENDING], WfReviewState::APPROVED);
        $workflow->addTransition('reject', [WfReviewState::PENDING], WfReviewState::REJECTED);

        $workflow->onAfterTransition('submit', static function () {
            WfProduct::$log[] = 'after-transition:submit';
        });
        $workflow->onAfterTransition('approve', static function () {
            WfProduct::$log[] = 'after-transition:approve';
        });
        $workflow->onBeforeChanged('*', '*', static function (TransitionEvent $e) {
            WfProduct::$log[] = "before-changed:{$e->froms}>{$e->to}";
        });
    }
}

#[Table('wf_products')]
class WfProduct
{
    public static ?WfReviewWorkflow $workflow = null;

    public static array $log = [];

    #[Column('id')]
    #[PK(primary: true)]
    public ?int $id = null;

    #[Column('title')]
    public string $title = '';

    #[Column('review_state')]
    #[Cast(WfReviewState::class)]
    public WfReviewState $reviewState = WfReviewState::DRAFT;

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        static::$workflow?->listen($metadata);
    }
}

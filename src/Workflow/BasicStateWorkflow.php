<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Unicorn\Attributes\StateMachine;
use Unicorn\Enum\BasicState;
use Unicorn\Enum\PublishingState;
use Windwalker\Core\Language\TranslatorTrait;

/**
 * The BasicStateWorkflow class.
 */
#[StateMachine(
    field: 'state',
    enum: BasicState::class,
    strict: true
)]
class BasicStateWorkflow implements WorkflowInterface
{
    use WorkflowTrait;
    use TranslatorTrait;

    public function prepare(WorkflowController $workflow, ?object $entity): void
    {
        $workflow->mustGetState(BasicState::PUBLISHED)
            ->icon('fa fa-fw fa-check')
            ->color('success');

        $workflow->mustGetState(BasicState::UNPUBLISHED)
            ->icon('fa fa-fw fa-xmark')
            ->color('danger');

        $workflow->addTransition(
            'publish',
            BasicState::UNPUBLISHED,
            BasicState::PUBLISHED
        )
            ->button('fa fa-fw fa-check', 'Publish');

        $workflow->addTransition(
            'unpublish',
            BasicState::PUBLISHED,
            BasicState::UNPUBLISHED
        )
            ->button('fa fa-fw fa-xmark', 'Unpublish');
    }
}

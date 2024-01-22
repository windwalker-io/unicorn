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
    enum: PublishingState::class,
    strict: true
)]
class PublishingStateWorkflow implements WorkflowInterface
{
    use WorkflowTrait;
    use TranslatorTrait;

    public function prepare(WorkflowController $workflow, ?object $entity): void
    {
        $workflow->getState(PublishingState::PUBLISHED)
            ?->icon('fa fa-fw fa-check')
            ->color('success');

        $workflow->getState(PublishingState::UNPUBLISHED)
            ?->icon('fa fa-fw fa-xmark')
            ->color('danger');

        $workflow->getState(PublishingState::TRASHED)
            ?->icon('fa fa-fw fa-trash');

        $workflow->getState(PublishingState::ARCHIVED)
            ?->icon('fa fa-fw fa-file-zipper');

        $workflow->setInitialStates(
            [
                PublishingState::PUBLISHED,
                PublishingState::UNPUBLISHED,
            ]
        );

        $workflow->addTransition(
            'publish',
            PublishingState::UNPUBLISHED,
            PublishingState::PUBLISHED
        )
            ->button('fa fa-fw fa-check', 'Publish');

        $workflow->addTransition(
            'unpublish',
            PublishingState::PUBLISHED,
            PublishingState::UNPUBLISHED
        )
            ->button('fa fa-fw fa-xmark', 'Unpublish');

        $workflow->addTransition(
            'archive',
            PublishingState::UNPUBLISHED,
            PublishingState::ARCHIVED(),
        )
            ->button('fa fa-fw fa-file-zipper', 'Archive');

        $workflow->addTransition(
            'trash',
            [
                PublishingState::UNPUBLISHED,
                PublishingState::PUBLISHED,
                PublishingState::ARCHIVED(),
            ],
            PublishingState::TRASHED(),
        )
            ->button('fa fa-fw fa-trash', 'Trash');

        $workflow->addTransition(
            'untrash',
            PublishingState::TRASHED(),
            PublishingState::UNPUBLISHED,
        )
            ->button('fa fa-fw fa-check', 'Untrash');
    }
}

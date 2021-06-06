<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Workflow;

use Unicorn\Attributes\StateMachine;
use Unicorn\Enum\BasicState;

/**
 * The BasicStateWorkflow class.
 */
#[StateMachine(
    field: 'state',
    enum: BasicState::class,
    strict: true
)]
class BasicStateWorkflow extends AbstractWorkflow
{
    public function configure(WorkflowController $workflow): void
    {
        $workflow->setStateMeta(BasicState::PUBLISHED(), 'Published', 'fa fa-fw fa-check', 'success');
        $workflow->setStateMeta(BasicState::UNPUBLISHED(), 'Unpublished', 'fa fa-fw fa-xmark', 'danger');
        $workflow->setStateMeta(BasicState::TRASHED(), 'Trashed', 'fa fa-fw fa-trash');
        $workflow->setStateMeta(BasicState::ARCHIVED(), 'Archived', 'fa fa-fw fa-file-zipper');

        $workflow->setInitialStates(
            [
                BasicState::PUBLISHED(),
                BasicState::UNPUBLISHED(),
            ]
        );

        $workflow->addTransition(
            'publish',
            BasicState::UNPUBLISHED(),
            BasicState::PUBLISHED()
        )
            ->button('fa fa-fw fa-check', 'Publish');

        $workflow->addTransition(
            'unpublish',
            BasicState::PUBLISHED(),
            BasicState::UNPUBLISHED()
        )
            ->button('fa fa-fw fa-xmark', 'Unpublish');

        $workflow->addTransition(
            'archive',
            BasicState::UNPUBLISHED(),
            BasicState::ARCHIVED(),
        )
            ->button('fa fa-fw fa-file-zipper', 'Archive');

        $workflow->addTransition(
            'trash',
            [
                BasicState::UNPUBLISHED(),
                BasicState::PUBLISHED(),
                BasicState::ARCHIVED(),
            ],
            BasicState::TRASHED(),
        )
            ->button('fa fa-fw fa-trash', 'Trash');

        $workflow->addTransition(
            'untrash',
            BasicState::TRASHED(),
            BasicState::UNPUBLISHED(),
        )
            ->button('fa fa-fw fa-check', 'Untrash');
    }
}

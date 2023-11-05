<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Workflow;

use Unicorn\Attributes\StateMachine;
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
class PublishingStateWorkflow extends AbstractWorkflow
{
    use TranslatorTrait;

    public function configure(WorkflowController $workflow): void
    {
        $workflow->setStateMeta(
            PublishingState::PUBLISHED,
            PublishingState::PUBLISHED->trans($this->lang),
            'fa fa-fw fa-check',
            'success'
        );
        $workflow->setStateMeta(
            PublishingState::UNPUBLISHED,
            PublishingState::UNPUBLISHED->trans($this->lang),
            'fa fa-fw fa-xmark',
            'danger'
        );
        $workflow->setStateMeta(
            PublishingState::TRASHED,
            PublishingState::TRASHED->trans($this->lang),
            'fa fa-fw fa-trash'
        );
        $workflow->setStateMeta(
            PublishingState::ARCHIVED,
            PublishingState::ARCHIVED->trans($this->lang),
            'fa fa-fw fa-file-zipper'
        );

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

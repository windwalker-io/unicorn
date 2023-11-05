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
class BasicStateWorkflow extends AbstractWorkflow
{
    use TranslatorTrait;

    public function configure(WorkflowController $workflow): void
    {
        $workflow->setStateMeta(
            BasicState::PUBLISHED(),
            BasicState::PUBLISHED()->trans($this->lang),
            'fa fa-fw fa-check',
            'success'
        );
        $workflow->setStateMeta(
            BasicState::UNPUBLISHED(),
            BasicState::UNPUBLISHED()->trans($this->lang),
            'fa fa-fw fa-xmark',
            'danger'
        );

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
    }
}

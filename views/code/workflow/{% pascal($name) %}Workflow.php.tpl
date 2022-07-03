{% $phpOpen %}

/**
 * Part of Windwalker project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace {% $ns %};

use Unicorn\Attributes\StateMachine;
use Unicorn\Workflow\AbstractWorkflow;
use Unicorn\Workflow\WorkflowController;

/**
 * The {% pascal($name) %}Workflow class.
 */
#[StateMachine(
    field: '{% snake($field) %}',
    enum: \App\Enum\{% pascal($name) %}::class,
    // Set to FALSE to allow free transition.
    strict: true
)]
class {% pascal($name) %}Workflow extends AbstractWorkflow
{
    public function configure(WorkflowController $workflow): void
    {
        $workflow->setAllowFreeTransitions(true);

        // $workflow->setInitialStates(
        //     []
        // );

        // $workflow->addTransition(
        //     'name',
        //     froms:,
        //     tos:
        // )
        //     ->button('icon-class', 'Name');
    }
}

{% $phpOpen %}

declare(strict_types=1);

namespace {% $ns %};

use Unicorn\Attributes\StateMachine;
use Unicorn\Workflow\WorkflowController;
use Unicorn\Workflow\WorkflowInterface;
use Unicorn\Workflow\WorkflowTrait;

#[StateMachine(
    field: '{% snake($field) %}',
    enum: \App\Enum\{% pascal($name) %}::class,
    // Set to FALSE to allow free transition.
    strict: true
)]
class {% pascal($name) %}Workflow implements WorkflowInterface
{
    use WorkflowTrait;

    public function prepare(WorkflowController $workflow, ?object $entity): void
    {
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

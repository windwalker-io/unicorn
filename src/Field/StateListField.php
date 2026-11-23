<?php

declare(strict_types=1);

namespace Unicorn\Field;

use HTMLElement;
use Unicorn\Workflow\WorkflowInterface;
use Windwalker\Form\Field\ListField;

/**
 * The StateListfField class.
 */
class StateListField extends ListField
{
    protected ?WorkflowInterface $workflow = null;

    /**
     * prepareOptions
     *
     * @return  array<HTMLElement|mixed>
     */
    protected function prepareOptions(): array
    {
        $options = [];
        $value = $this->getValue();

        $workflow = $this->getWorkflow();

        if ($workflow === null) {
            throw new \LogicException('StateListField requires a workflow. Call workflow() before rendering.');
        }

        $workflow = $workflow->compile();

        if ((string) $value === '') {
            $states = $workflow->getInitialStates();
        } else {
            $states = $workflow->getAvailableStates($value);
        }

        foreach ($states as $state) {
            $options[] = static::createOption($state->getTitle(), $state->getValue());
        }

        return $options;
    }

    /**
     * @return  WorkflowInterface|null
     */
    public function getWorkflow(): ?WorkflowInterface
    {
        return $this->workflow;
    }

    /**
     * @param  WorkflowInterface|null  $workflow
     *
     * @return  static  Return self to support chaining.
     */
    public function workflow(?WorkflowInterface $workflow): static
    {
        $this->workflow = $workflow;

        return $this;
    }
}

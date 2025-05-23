<?php

declare(strict_types=1);

namespace Unicorn\Field;

use HTMLElement;
use Unicorn\Workflow\AbstractWorkflow;
use Windwalker\Form\Field\ListField;

/**
 * The StateListfField class.
 */
class StateListField extends ListField
{
    protected ?AbstractWorkflow $workflow = null;

    /**
     * prepareOptions
     *
     * @return  array<HTMLElement|mixed>
     */
    protected function prepareOptions(): array
    {
        $options = [];
        $value = $this->getValue();
        $workflow = $this->getWorkflow()->getWorkflowController();

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
     * @return AbstractWorkflow|null
     */
    public function getWorkflow(): ?AbstractWorkflow
    {
        return $this->workflow;
    }

    /**
     * @param  AbstractWorkflow|null  $workflow
     *
     * @return  static  Return self to support chaining.
     */
    public function workflow(?AbstractWorkflow $workflow): static
    {
        $this->workflow = $workflow;

        return $this;
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Workflow\Exception;

use Throwable;
use Unicorn\Workflow\AbstractWorkflow;
use Windwalker\Core\Form\Exception\ValidateFailException;

/**
 * The TransitionException class.
 */
class TransitionDisallowException extends ValidateFailException
{
    public function __construct(
        protected string $form,
        protected string $to,
        protected AbstractWorkflow $workflow,
        array|string $messages = null,
        int $code = 0,
        ?Throwable $previous = null
    ) {
        parent::__construct($messages, $code, $previous);
    }

    /**
     * @return string
     */
    public function getForm(): string
    {
        return $this->form;
    }

    /**
     * @param  string  $form
     *
     * @return  static  Return self to support chaining.
     */
    public function setForm(string $form): static
    {
        $this->form = $form;

        return $this;
    }

    /**
     * @return string
     */
    public function getTo(): string
    {
        return $this->to;
    }

    /**
     * @param  string  $to
     *
     * @return  static  Return self to support chaining.
     */
    public function setTo(string $to): static
    {
        $this->to = $to;

        return $this;
    }

    /**
     * @return AbstractWorkflow
     */
    public function getWorkflow(): AbstractWorkflow
    {
        return $this->workflow;
    }

    /**
     * @param  AbstractWorkflow  $workflow
     *
     * @return  static  Return self to support chaining.
     */
    public function setWorkflow(AbstractWorkflow $workflow): static
    {
        $this->workflow = $workflow;

        return $this;
    }
}

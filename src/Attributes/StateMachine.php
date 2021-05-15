<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Attributes;

use MyCLabs\Enum\Enum;
use Unicorn\Workflow\AbstractWorkflow;
use Unicorn\Workflow\WorkflowController;
use Windwalker\DI\Attributes\AttributeHandler;
use Windwalker\DI\Attributes\ContainerAttributeInterface;

/**
 * The StateMachine class.
 */
#[\Attribute(\Attribute::TARGET_CLASS)]
class StateMachine implements ContainerAttributeInterface
{
    /**
     * StateMachine constructor.
     */
    public function __construct(
        public string $field,
        public ?string $enum = null,
        public bool $strict = false,
    )
    {
    }

    public function __invoke(AttributeHandler $handler): callable
    {
        return function (...$args) use ($handler) {
            /** @var AbstractWorkflow $machine */
            $machine = $handler(...$args);

            $workflow = new WorkflowController();
            $workflow->setField($this->field);

            if (is_a($this->enum, Enum::class, true)) {
                $class = $this->enum;
                $workflow->setStates($class::values());
            }

            $workflow->setAllowFreeTransitions(!$this->strict);

            $machine->setWorkflowController($workflow);

            return $machine;
        };
    }
}

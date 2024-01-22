<?php

declare(strict_types=1);

namespace Unicorn\Attributes;

use MyCLabs\Enum\Enum;
use Unicorn\Workflow\WorkflowInterface;
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
        public ?string $field = null,
        public ?string $enum = null,
        public bool $strict = false,
        public array $options = []
    ) {
        //
    }

    public function __invoke(AttributeHandler $handler): callable
    {
        return function (...$args) use ($handler) {
            /** @var WorkflowInterface $machine */
            $machine = $handler(...$args);

            $machine->setField($this->field);
            $machine->setDefaultEnum($this->enum);
            $machine->setStrict($this->strict);
            $machine->setOptions($this->options);

            return $machine;
        };
    }
}

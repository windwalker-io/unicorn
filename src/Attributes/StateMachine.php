<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Attributes;

use MyCLabs\Enum\Enum;
use Unicorn\Workflow\AbstractWorkflow;
use Unicorn\Workflow\WorkflowController;
use Windwalker\Core\Language\LangService;
use Windwalker\DI\Attributes\AttributeHandler;
use Windwalker\DI\Attributes\ContainerAttributeInterface;
use Windwalker\Utilities\Enum\EnumMetaInterface;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;

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
    ) {
        //
    }

    public function __invoke(AttributeHandler $handler): callable
    {
        return function (...$args) use ($handler) {
            /** @var AbstractWorkflow $machine */
            $machine = $handler(...$args);
            $container = $handler->getContainer();

            $workflow = new WorkflowController();
            $workflow->setField($this->field);

            if (is_a($this->enum, Enum::class, true)) {
                $class = $this->enum;
                $workflow->setStates($class::values());

                if (is_subclass_of($class, EnumTranslatableInterface::class)) {
                    $lang = $container->get(LangService::class);
                    $workflow->setStateTitles($class::getTransItems($lang));
                }

                if (is_subclass_of($class, EnumMetaInterface::class)) {
                    show($class::getIcons());
                    foreach ($class::getIcons() as $state => $icon) {
                        $workflow->getState($state)?->icon($icon);
                    }

                    foreach ($class::getColors() as $state => $icon) {
                        $workflow->getState($state)?->color($icon);
                    }
                }
            }

            $workflow->setAllowFreeTransitions(!$this->strict);

            $machine->setWorkflowController($workflow);

            return $machine;
        };
    }
}

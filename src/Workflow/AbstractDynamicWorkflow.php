<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Windwalker\ORM\Metadata\EntityMetadata;

abstract class AbstractDynamicWorkflow implements WorkflowInterface
{
    protected WorkflowController $controller;

    public function getController(?object $entity = null, ?string $field = null): WorkflowController
    {
        $controller = new WorkflowController();
        $this->configure($controller, $entity);

        return $controller;
    }

    abstract public function configure(WorkflowController $workflow, ?object $entity = null): void;
}

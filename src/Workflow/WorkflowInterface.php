<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Windwalker\ORM\Metadata\EntityMetadata;

interface WorkflowInterface
{
    public function getController(?object $entity = null, ?string $field = null): WorkflowController;

    public function listen(EntityMetadata $metadata, ?string $field = null): void;
}

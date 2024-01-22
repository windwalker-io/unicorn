<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

use Windwalker\ORM\Metadata\EntityMetadata;
use Windwalker\Utilities\Contract\AccessibleInterface;

interface WorkflowInterface
{
    public function compile(
        ?object $entity = null,
        ?string $field = null,
        array $options = []
    ): WorkflowController;

    public function listen(EntityMetadata $metadata, ?string $field = null, array $options = []): void;

    public function setField(?string $field): static;

    public function isStrict(): bool;

    public function setDefaultEnum(?string $defaultEnum): static;

    public function setOptions(array|\ArrayAccess|AccessibleInterface $options): static;
}

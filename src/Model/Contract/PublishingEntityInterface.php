<?php

declare(strict_types=1);

namespace Unicorn\Model\Contract;

interface PublishingEntityInterface
{
    public function isTrashed(): bool;

    public function makeTrashed(): static;

    public function isArchived(): bool;

    public function makeArchived(): static;

    public function isPublished(): bool;

    public function publish(): static;

    public function isUnpublished(): bool;

    public function unpublish(): static;
}

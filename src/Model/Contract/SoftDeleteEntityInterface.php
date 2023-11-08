<?php

declare(strict_types=1);

namespace Unicorn\Model\Contract;

use Windwalker\Core\DateTime\Chronos;

interface SoftDeleteEntityInterface
{
    public function isDeleted(): bool;

    public function setIsDeleted(bool $isDeleted): static;

    public function getDeletedAt(): ?Chronos;

    public function setDeletedAt(\DateTimeInterface|string|int|null $deletedAt): static;
}

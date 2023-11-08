<?php

declare(strict_types=1);

namespace Unicorn\Model\Traits;

use Windwalker\Core\DateTime\Chronos;
use Windwalker\Core\DateTime\ServerTimeCast;
use Windwalker\ORM\Attributes\CastNullable;
use Windwalker\ORM\Attributes\Column;

trait SortDeleteEntityTrait
{
    #[Column('is_deleted')]
    protected bool $isDeleted = false;

    #[Column('deleted_at')]
    #[CastNullable(ServerTimeCast::class)]
    protected ?Chronos $deletedAt = null;

    public function softDelete(): static
    {
        return $this->setIsDeleted(true);
    }

    public function undelete(): static
    {
        return $this->setIsDeleted(false);
    }

    public function isDeleted(): bool
    {
        return $this->isDeleted;
    }

    public function setIsDeleted(bool $isDeleted): static
    {
        $this->isDeleted = $isDeleted;

        if ($isDeleted) {
            $this->setDeletedAt('now');
        } else {
            $this->setDeletedAt(null);
        }

        return $this;
    }

    public function getDeletedAt(): ?Chronos
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(\DateTimeInterface|string|int|null $deletedAt): static
    {
        $this->deletedAt = Chronos::wrapOrNull($deletedAt);

        return $this;
    }
}

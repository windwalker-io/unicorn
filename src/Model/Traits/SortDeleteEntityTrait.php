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
    public bool $isDeleted = false {
        set(bool $value) {
            $this->isDeleted = $value;

            if ($value) {
                $this->deletedAt = 'now';
            } else {
                $this->deletedAt = null;
            }
        }
    }

    #[Column('deleted_at')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $deletedAt = null {
        set(\DateTimeInterface|string|null $value) {
            $this->deletedAt = Chronos::tryWrap($value);
        }
    }

    public function softDelete(): static
    {
        return $this->setIsDeleted(true);
    }

    public function undelete(): static
    {
        return $this->setIsDeleted(false);
    }

    /**
     * @return  bool
     *
     * @deprecated  Use property instead.
     */
    public function isDeleted(): bool
    {
        return $this->isDeleted;
    }

    /**
     * @param  bool  $isDeleted
     *
     * @return  $this
     *
     * @deprecated  Use property instead.
     */
    public function setIsDeleted(bool $isDeleted): static
    {
        $this->isDeleted = $isDeleted;

        return $this;
    }

    /**
     * @return  Chronos|null
     *
     * @deprecated  Use property instead.
     */
    public function getDeletedAt(): ?Chronos
    {
        return $this->deletedAt;
    }

    /**
     * @param  \DateTimeInterface|string|int|null  $deletedAt
     *
     * @return  $this
     *
     * @deprecated  Use property instead.
     */
    public function setDeletedAt(\DateTimeInterface|string|int|null $deletedAt): static
    {
        $this->deletedAt = Chronos::wrapOrNull($deletedAt);

        return $this;
    }
}

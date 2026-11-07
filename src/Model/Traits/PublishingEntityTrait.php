<?php

declare(strict_types=1);

namespace Unicorn\Model\Traits;

use Unicorn\Enum\PublishingState;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\Core\DateTime\ServerTimeCast;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\ORM\Attributes\CastNullable;
use Windwalker\ORM\Attributes\Column;

trait PublishingEntityTrait
{
    #[Column('state')]
    #[Cast('int')]
    #[Cast(PublishingState::class)]
    public PublishingState $state {
        set(int|PublishingState $value) => $this->state = PublishingState::wrap($value);
    }

    #[Column('deleted_at')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $deletedAt = null {
        set(\DateTimeInterface|string|null $value) => $this->deletedAt = Chronos::tryWrap($value);
    }

    public function isTrashed(): bool
    {
        return $this->getState()->isTrashed();
    }

    public function makeTrashed(): static
    {
        $this->setState(PublishingState::TRASHED);

        return $this;
    }

    public function isArchived(): bool
    {
        return $this->getState()->isArchived();
    }

    public function makeArchived(): static
    {
        $this->setState(PublishingState::ARCHIVED);

        return $this;
    }

    public function isPublished(): bool
    {
        return $this->getState()->isPublished();
    }

    public function publish(): static
    {
        $this->setState(PublishingState::PUBLISHED);

        return $this;
    }

    public function isUnpublished(): bool
    {
        return $this->getState()->isUnpublished();
    }

    public function unpublish(): static
    {
        $this->setState(PublishingState::UNPUBLISHED);

        return $this;
    }

    public function getState(): PublishingState
    {
        return $this->state;
    }

    public function setState(PublishingState|int $state): static
    {
        $this->state = PublishingState::wrap($state);

        return $this;
    }
}

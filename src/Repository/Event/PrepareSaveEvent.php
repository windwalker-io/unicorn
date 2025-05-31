<?php

declare(strict_types=1);

namespace Unicorn\Repository\Event;

use Windwalker\Event\BaseEvent;
use Windwalker\Utilities\Accessible\AccessorBCTrait;

/**
 * The PrepareSaveEvent class.
 */
#[\Attribute]
class PrepareSaveEvent extends BaseEvent
{
    use AccessorBCTrait;

    public function __construct(
        public array $data = [],
        public array|object $source = [],
        public array|string|null $condFields = null,
        public int $options = 0
    ) {
    }

    /**
     * @return array|object
     *
     * @deprecated  Use property instead.
     */
    public function &getSource(): object|array
    {
        return $this->source;
    }

    /**
     * @return array
     *
     * @deprecated  Use property instead.
     */
    public function &getData(): array
    {
        return $this->data;
    }
}

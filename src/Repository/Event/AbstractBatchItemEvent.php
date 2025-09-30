<?php

declare(strict_types=1);

namespace Unicorn\Repository\Event;

use Unicorn\Repository\Actions\BatchAction;
use Windwalker\Event\BaseEvent;
use Windwalker\ORM\ORM;
use Windwalker\Utilities\Accessible\AccessorBCTrait;

/**
 * The AbstractBatchItemEvent class.
 */
abstract class AbstractBatchItemEvent extends BaseEvent
{
    use AccessorBCTrait;

    public bool $isCopy {
        get => $this->task === 'copy';
    }

    public bool $isUpdate {
        get => $this->task === 'update';
    }

    public function __construct(
        public ORM $orm,
        public BatchAction $action,
        public mixed $id,
        public string $task = '',
        public array $data = [],
    ) {
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

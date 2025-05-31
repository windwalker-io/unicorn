<?php

declare(strict_types=1);

namespace Unicorn\Repository\Event;

use Unicorn\Repository\Actions\BatchAction;
use Windwalker\Event\BaseEvent;
use Windwalker\ORM\ORM;
use Windwalker\Utilities\Accessible\AccessorBCTrait;

/**
 * The AbstractBatchEvent class.
 */
abstract class AbstractBatchEvent extends BaseEvent
{
    use AccessorBCTrait;

    public bool $isCopy {
        get => $this->task === 'copy';
    }

    public bool $isUpdate {
        get => $this->task === 'update';
    }

    public ORM $orm;
    public BatchAction $action;

    public function __construct(
        ?ORM $orm = null,
        ?BatchAction $action = null,
        public array $ids = [],
        public string $task = '',
        public array $data = [],
    ) {
        if ($orm) {
            $this->orm = $orm;
        }

        if ($action) {
            $this->action = $action;
        }
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

    /**
     * @return array
     *
     * @deprecated  Use property instead.
     */
    public function &getIds(): array
    {
        return $this->ids;
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Repository\Event;

use Unicorn\Repository\Actions\BatchAction;
use Windwalker\ORM\ORM;

/**
 * The AfterBatchEvent class.
 */
#[\Attribute]
class AfterBatchEvent extends AbstractBatchEvent
{
    public function __construct(
        ?ORM $orm = null,
        ?BatchAction $action = null,
        array $ids = [],
        string $task = '',
        array $data = [],
        /**
         * @var array<object>
         */
        public array $items = [],
    ) {
        parent::__construct(
            orm: $orm,
            action: $action,
            ids: $ids,
            task: $task,
            data: $data
        );
    }
}

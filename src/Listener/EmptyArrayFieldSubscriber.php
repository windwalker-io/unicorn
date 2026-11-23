<?php

declare(strict_types=1);

namespace Unicorn\Listener;

use Windwalker\Core\Http\Event\RequestGetValueEvent;
use Windwalker\DI\Container;
use Windwalker\Event\Attributes\EventSubscriber;
use Windwalker\Event\Attributes\ListenTo;

/**
 * The EmptyArrayFieldSubscriber class.
 */
#[EventSubscriber]
class EmptyArrayFieldSubscriber
{
    public function __construct(protected Container $container, protected string $emptyValue = '__EMPTY_ARRAY__') {}

    #[ListenTo(RequestGetValueEvent::class)]
    public function requestGetValue(RequestGetValueEvent $event): void
    {
        if (
            $event->type !== RequestGetValueEvent::TYPE_BODY
            && $event->type !== RequestGetValueEvent::TYPE_QUERY
        ) {
            return;
        }

        $values = &$event->values;

        $values = $this->resolveMarkers($values);
    }

    /**
     * Replace marker values: a scalar marker becomes [], and a marker inside a list is dropped.
     */
    protected function resolveMarkers(mixed $value): mixed
    {
        if (!is_array($value)) {
            return $value === $this->emptyValue ? [] : $value;
        }

        $isList = array_is_list($value);
        $result = [];

        foreach ($value as $k => $v) {
            if (!$isList && $v === $this->emptyValue) {
                $result[$k] = [];
                continue;
            }

            if ($isList && $v === $this->emptyValue) {
                continue;
            }

            $resolved = $this->resolveMarkers($v);

            if ($isList) {
                $result[] = $resolved;
            } else {
                $result[$k] = $resolved;
            }
        }

        return $result;
    }
}

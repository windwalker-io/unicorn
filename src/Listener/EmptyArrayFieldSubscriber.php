<?php

declare(strict_types=1);

namespace Unicorn\Listener;

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Events\Web\BeforeControllerDispatchEvent;
use Windwalker\Core\Events\Web\BeforeRequestEvent;
use Windwalker\Core\Http\AppRequest;
use Windwalker\Core\Http\Event\RequestGetValueEvent;
use Windwalker\DI\Container;
use Windwalker\Event\Attributes\EventSubscriber;
use Windwalker\Event\Attributes\ListenTo;
use Windwalker\Utilities\Arr;

/**
 * The EmptyArrayFieldSubscriber class.
 */
#[EventSubscriber]
class EmptyArrayFieldSubscriber
{
    public function __construct(protected Container $container, protected string $emptyValue = '__EMPTY_ARRAY__')
    {
    }

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

        $values = Arr::mapRecursive(
            $values,
            function (mixed $value) {
                if ($value === $this->emptyValue) {
                    return [];
                }

                return $value;
            }
        );
    }
}

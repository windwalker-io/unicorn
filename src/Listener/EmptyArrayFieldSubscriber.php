<?php

/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2022 __ORGANIZATION__.
 * @license    __LICENSE__
 */

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
    public function __construct(protected Container $container, protected $emptyValue = '__EMPTY_ARRAY__')
    {
    }

    #[ListenTo(RequestGetValueEvent::class)]
    public function requestGetValue(RequestGetValueEvent $event): void
    {
        if (
            $event->getType() !== RequestGetValueEvent::TYPE_BODY
            && $event->getType() !== RequestGetValueEvent::TYPE_QUERY
        ) {
            return;
        }

        $values = &$event->getValues();

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

<?php

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Attributes\Ajax;
use Windwalker\Attributes\AttributesAccessor;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\JsonApi;
use Windwalker\Core\Router\Exception\RouteNotFoundException;

/**
 * Trait AjaxControllerTrait
 */
trait AjaxControllerTrait
{
    #[JsonApi]
    public function ajax(AppContext $app): mixed
    {
        $task = $app->input('task') ?? 'index';

        if (!method_exists($this, $task)) {
            throw new RouteNotFoundException('Action not found.');
        }

        $callable = [$this, $task];

        $ajaxAttr = AttributesAccessor::getFirstAttribute($callable, Ajax::class);

        if (!$ajaxAttr) {
            throw new RouteNotFoundException(
                WINDWALKER_DEBUG
                    ? "$task() is not an AJAX method, try add #[Ajax] to method"
                    : 'Action not found.'
            );
        }

        return $app->call($callable);
    }
}

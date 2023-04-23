<?php

/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Controller;

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\JsonApi;

/**
 * Trait AjaxControllerTrait
 */
trait AjaxControllerTrait
{
    #[JsonApi]
    public function ajax(AppContext $app): mixed
    {
        $task = $app->input('task');

        return $app->call([$this, $task]);
    }
}

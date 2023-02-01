<?php

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var $vm        object          The view model object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

declare(strict_types=1);

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

?>

<span class="c-flat-list-toggle-all">
    (
    <a href="javascript://" class="c-flat-list-option__toggle-all"
        data-task="children-toggle"
        data-toggle="all"
    >
        @lang('unicorn.field.flat.list.button.check.all')
    </a>
    |
    <a href="javascript://" class="c-flat-list-option__toggle-none"
        data-task="children-toggle"
        data-toggle="none"
    >
        @lang('unicorn.field.flat.list.button.uncheck.all')
    </a>
    )
</span>

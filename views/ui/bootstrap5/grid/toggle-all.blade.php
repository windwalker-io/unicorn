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

$store ??= 'grid';
?>
<div class="form-inline">
    <input type="checkbox"
        data-task="toggle-all"
        :x-title="'toggle-all_' + grid.form.getElement().id"
        x-data="{ grid: $store['{{ $store }}'] }"
        class="form-check-input"
        @click="grid.toggleAll($event.target.checked)"
    />
</div>

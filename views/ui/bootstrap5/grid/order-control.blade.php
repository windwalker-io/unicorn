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

/**
 * @var string $id
 * @var int    $row
 * @var int    $value
 * @var string $store
 */
$enabled ?? false;
?>

@if ($enabled)
    <div class="input-group c-order-control flex-nowrap"
        x-id="order-control-{{ $row  }}"
        x-data="{ grid: $store.{{ $store ?? 'grid' }} }"
    >
        <input type="text" class="form-control form-control-sm" 
            data-order-row="{{ $row }}"
            name="ordering[{{ $id }}]" value="{{ $value }}"
            onkeydown="if(event.keyCode == 13) return false;" />
        <button type="button" class="btn btn-default btn-outline-secondary btn-sm has-tooltip"
            @click="grid.moveUp({{ $id }});"
            title="@lang('unicorn.grid.ordering.moveup')">
            <span class="fa fa-chevron-up"></span>
        </button>
        <button type="button" class="btn btn-default btn-outline-secondary btn-sm has-tooltip"
            @click="grid.moveDown({{ $id }});"
            title="@lang('unicorn.grid.ordering.movedown')">
            <span class="fa fa-chevron-down"></span>
        </button>
    </div>
@endif

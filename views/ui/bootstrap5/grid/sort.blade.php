<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var $view      ViewModel       The view modal object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

$store ??= 'grid';

$uid = \Windwalker\uid();
?>

<a href="javascript: void(0);"
    class="text-decoration-none"
    x-title="sort"
    x-ref="root"
    x-data="{ grid: $store.{{ $store }}, $root: $el }"
    data-field="{{ $field ?? '' }}"
    data-asc="{{ $asc ?? '' }}"
    data-desc="{{ $desc ?? '' }}"
    @click="grid.sort($root)"
    data-bs-toggle="tooltip"
    title="@lang('unicorn.grid.sort.button')">
    {!! $slot ?? "- Sort: $field -" !!}

    <template x-if="grid.isSortActive($root)">
        <small
            class="fa"
            :class="{
                'fa-caret-down': grid.getDirection($root) === 'ASC',
                'fa-caret-up': grid.getDirection($root) === 'DESC'
            }"
        ></small>
    </template>
</a>

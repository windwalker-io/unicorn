<?php

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

declare(strict_types=1);

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

?>

<a href="javascript: void(0);"
    x-data="gridState"
    data-field="{{ $field }}"
    data-asc="{{ $asc ?? '' }}"
    data-desc="{{ $desc ?? '' }}"
    @click="grid.sort('{{ $field }}', $refs.gridForm.dataset.direction === 'ASC' ? 'DESC' : 'ASC')"
    data-bs-toggle="tooltip"
    title="@lang('phoenix.grid.sort.button')">
    {!! $slot ?? "- Sort: $field -" !!}

    <template x-if="isSortActive($el)">
        <small
            class="fa"
            :class="[ $refs.gridForm.dataset.direction === 'ASC' ? 'fa-caret-down' : 'fa-caret-up' ]"
        ></small>
    </template>
</a>

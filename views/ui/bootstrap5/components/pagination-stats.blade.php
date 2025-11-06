<?php

declare(strict_types=1);

namespace App\view;

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

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $pagination Pagination
 */

$attributes->props('pagination');

$itemClass ??= 'page-item';
$linkClass ??= 'page-link';

$attributes['style'] = $attributes['style'] ?: '--bs-pagination-color: var(--bs-secondary); --bs-pagination-bg: var(--bs-light);';
$attributes = $attributes->class('l-pagination-stats  pagination');

$forceStyle = '--bs-pagination-hover-color: var(--bs-pagination-color);';

$attributes['style'] .= $forceStyle;
?>
<div {!! $attributes !!}>
    {!! $start ?? '' !!}

    <div class="l-pagination-stats__item {{ $itemClass }}">
        <div class="{{ $linkClass }}">
            第 <strong>{{ $pagination->getCurrent() }}</strong> 頁
        </div>
    </div>

    <div class="l-pagination-stats__item {{ $itemClass }}">
        <div class="{{ $linkClass }}">
            每頁 <strong>{{ $pagination->getLimit() }}</strong> 筆
        </div>
    </div>

    @if (!$pagination->isSimple())
        <div class="l-pagination-stats__item {{ $itemClass }}">
            <div class="{{ $linkClass }}">
                共 <strong>{{ $pagination->getPages() }}</strong> 頁
            </div>
        </div>

        <div class="l-pagination-stats__item {{ $itemClass }}">
            <div class="{{ $linkClass }}">
                總數 <strong>{{ $pagination->getTotal() }}</strong>
            </div>
        </div>
    @endif

    {!! $end ?? '' !!}
</div>

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

<div class="card {{ $class ?? '' }}">
    @if ($header ?? null)
        <div class="card-header {{ $headerClass ?? '' }}">
            {!! $header !!}
        </div>
    @endif

    @if ($start ?? null)
        {!! $start !!}
    @endif

    @if ($slot ?? null)
        <div class="card-body {{ $bodyClass ?? '' }}">
            {!! $slot !!}
        </div>
    @endif

    @if ($end ?? null)
        {!! $end !!}
    @endif

    @if ($footer ?? null)
        <div class="card-header {{ $footerClass ?? '' }}">
            {!! $footer !!}
        </div>
    @endif
</div>

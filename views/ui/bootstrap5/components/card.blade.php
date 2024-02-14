<?php

declare(strict_types=1);

namespace App\View;

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
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/** @var \Windwalker\Edge\Component\ComponentAttributes $attributes */
$attributes = $attributes->class('card');
$attributes = $attributes->exceptProps(
    [
        'title',
        'title-class',
        'footer-title',
        'footer-class',
        'name'
    ]
);
$titleTag ??= 'h4';
?>

<div {!! $attributes !!}>
    @if ($header ?? null)
        @if (is_string($header))
            <div class="card-header {{ $headerClass ?? '' }}">
                {!! $header ?? '' !!}
            </div>
        @elseif (is_callable($header))
            {!! $header(headerClass: $headerClass ?? '') !!}
        @endif
    @endif

    @if ($start ?? null)
        {!! $start() !!}
    @endif

    @if ($body ?? null)
        {!! $body(bodyClass: $bodyClass ?? '') !!}
    @else
        @if ($slot ?? null)
            <div class="card-body {{ $bodyClass ?? '' }}">

                @if ($title ?? null)
                    @if (is_callable($title))
                        {!! $title(titleClass: $titleClass ?? '') !!}
                    @else
                        <{{ $titleTag }} class="card-title mb-4 {{ $titleClass ?? '' }}">
                            {!! $title ?? '' !!}
                        </{{ $titleTag }}>
                    @endif
                @endif

                {!! $slot !!}
            </div>
        @endif
    @endif

    @if ($end ?? null)
        {!! $end() !!}
    @endif

    @if ($footer ?? null)
        {!! $footer(footerClass: $footerClass ?? '') !!}
    @elseif ($footerTitle ?? null)
        <div class="card-footer {{ $footerClass ?? '' }}">
            {!! $footerTitle ?? '' !!}
        </div>
    @endif
</div>

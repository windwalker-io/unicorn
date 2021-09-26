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

/** @var \Windwalker\Edge\Component\ComponentAttributes $attributes */

$attributes = $attributes->class('input-group');
$attributes = $attributes->exceptProps(['tag-name']);

$tagName ??= 'div';
?>

<{{ $tagName }} {!! $attributes !!}>
    @if ($start ?? null)
    <div class="input-group-prepend">
        {!! $start !!}
    </div>
    @endif

    {!! $slot !!}

    @if ($end ?? null)
    <div class="input-group-append">
        {!! $end ?? '' !!}
    </div>
    @endif
</{{ $tagName }}>

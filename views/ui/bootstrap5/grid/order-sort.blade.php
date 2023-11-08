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

/**
 * @var string                     $id
 * @var int|string                 $row
 * @var int                        $value
 * @var string                     $store
 * @var ComponentAttributes        $attributes
 */

$props = $attributes->props(
    'enabled',
    'field',
    'asc',
    'desc'
);

$enabled = $props->enabled ?? throw new \RuntimeException('x-order-control missing :enabled value');

?>
<div class="d-flex w-100 justify-content-end">
    <x-sort
        :field="$props->field"
        :asc="$props->asc"
        :desc="$props->desc"
    >
        @lang('unicorn.field.ordering')
    </x-sort>
    @if($enabled)
        <x-save-order class="ml-2 ms-2"></x-save-order>
    @endif
</div>

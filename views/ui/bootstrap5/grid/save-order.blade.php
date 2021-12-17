<?php

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app           \Windwalker\Web\Application                 Global Application
 * @var $package       \Windwalker\Core\Package\AbstractPackage    Package object.
 * @var $view          \Windwalker\Data\Data                       Some information of this view.
 * @var $uri           \Windwalker\Uri\UriData                     Uri information, example: $uri->path
 * @var $datetime      \DateTime                                   PHP DateTime object of current time.
 * @var $helper        \Windwalker\Core\View\Helper\Set\HelperSet  The Windwalker HelperSet object.
 * @var $router        \Windwalker\Core\Router\PackageRouter       Router object.
 * @var $asset         \Windwalker\Core\Asset\AssetManager         The Asset manager.
 */

declare(strict_types=1);

$store ??= 'grid';

/** @var \Windwalker\Edge\Component\ComponentAttributes $attributes */
$attributes = $attributes->except('grid');
$attributes = $attributes->class('btn btn-default btn-outline-secondary btn-sm px-1 py-0');
?>

<button type="button"
    :x-title="grid.getId('__save-order')"
    x-data="{ grid: $store.{{ $store }} }"
    @click="grid.reorderAll();"
    title="@lang('unicorn.grid.ordering.saveorder')"
    {!! $attributes !!}
>
    <span class="fa fa-save"></span>
</button>

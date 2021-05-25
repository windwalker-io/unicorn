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
?>

<button type="button" class="btn btn-default btn-outline-secondary btn-sm px-1 py-0"
    :x-id="grid.getId('__save-order')"
    x-data="{ grid: $store.{{ $store }} }"
    @click="grid.reorderAll();"
    title="@lang('unicorn.grid.ordering.saveorder')">
    <span class="fa fa-save"></span>
</button>

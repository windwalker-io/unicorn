<?php

declare(strict_types=1);

namespace App\View;

use Unicorn\Html\Breadcrumb;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Edge\Component\ComponentAttributes;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext                 Global Application
 * @var $view      ViewModel                       Some information of this view.
 * @var $uri       SystemUri                     Uri information, example: $uri->path
 * @var $chronos   ChronosService   PHP DateTime object of current time.
 * @var $nav       Navigator       Router object.
 * @var $asset     AssetService         The Asset manager.
 * @var $lang      LangService         The language.
 */

/** @var Breadcrumb $breadcrumb */
$items = $items ?? $breadcrumb->getItems();

$attributes ??= null;

/** @var ComponentAttributes $attributes */
if ($attributes) {
    $attributes = $attributes->except(['breadcrumb', 'items']);
}
?>

<nav aria-label="breadcrumb" {!! $attributes !!}
    itemscope itemtype="https://schema.org/BreadcrumbList">
    <ol class="breadcrumb mb-0">
        @foreach ($items as $i => $path)
            <li class="breadcrumb-item {{ $path['active'] ? 'active' : '' }} {{ $itemClass ?? '' }}"
                @attr('aria-current', $path['active'] ? 'page' : null)
                itemprop="itemListElement"
                itemscope
                itemtype="https://schema.org/ListItem"
            >
                <a @attr('href', $path['link'] ?: null)
                    itemprop="item">
                    <span itemprop="name">{{ $path['title'] }}</span>
                    <meta itemprop="position" content="{{ $i + 1 }}" />
                </a>
            </li>
        @endforeach
    </ol>
</nav>


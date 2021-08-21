<?php

declare(strict_types=1);

namespace App\View;

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

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

?>

<nav class="{{ $class ?? '' }}" aria-label="breadcrumb">
    <ol class="breadcrumb">
        @foreach ($paths as $i => $path)
            <li class="breadcrumb-item {{ $path['active'] ? 'active' : '' }} {{ $itemClass ?? '' }}"
                aria-current="page">
                <a @attr('href', $path->link ?: null) >
                    {{ $path['title'] }}
                </a>
            </li>
        @endforeach
    </ol>
</nav>


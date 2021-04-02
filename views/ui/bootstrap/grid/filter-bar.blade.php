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
use Windwalker\Form\Form;

/**
 * @var Form $form
 */

?>

<div class="c-filter-bar">
    <div class="c-filter-bar-top d-flex">
        <div class="c-filter-bar__top-start">
            <div class="input-group">
                {!! $form->getField('search/content')->renderInput() !!}

                <button class="btn btn-outline-secondary">
                    Search
                </button>
            </div>
        </div>

        <div class="c-filter-bar__top-end ml-auto">

        </div>
    </div>
</div>

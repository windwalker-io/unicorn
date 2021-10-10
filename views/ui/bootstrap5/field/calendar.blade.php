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

$app->service(\Unicorn\Script\FormScript::class)->flatpickr();
?>

<uni-flatpickr options="{{ json_encode($options ?? []) }}"
    selector="[data-calendar]">
    <div class="input-group flatpickr" data-calendar>
        {!! $input !!}

        @if ($field->canModify())
            <button class="btn btn-secondary" type="button" data-toggle>
                <span class="fa fa-calendar"></span>
            </button>
            <button class="btn btn-secondary" type="button" data-clear>
                <span class="fa fa-times"></span>
            </button>
        @endif
    </div>
</uni-flatpickr>

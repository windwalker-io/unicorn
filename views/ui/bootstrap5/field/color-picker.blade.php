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

$app->service(\Unicorn\Script\FormScript::class)->colorPicker();

$input['data-role'] = 'color-text';
?>

<x-input-group uni-color-picker>
    {!! $input !!}

    <div class="" style="visibility: hidden; width: 0; overflow: hidden;"
        data-role="input-container">

    </div>

    <x-slot name="end">
        <button type="button" class="btn btn-outline-secondary" data-role="color-preview" data-task="pick-color"
            style="min-width: 45px; cursor: pointer;">
            <i class="fa fa-circle-dot"></i>
        </button>
    </x-slot>
</x-input-group>

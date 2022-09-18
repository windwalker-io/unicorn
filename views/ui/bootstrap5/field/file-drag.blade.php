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
 * @var \Unicorn\Field\FileDragField $field
 */

$app->service(\Unicorn\Script\FormScript::class)->fileDrag();
?>

<uni-file-drag class="custom-file c-file-drag-input" style="visibility: hidden;"
    options="{{ json_encode($options) }}">
    {!! $input !!}
    <label class="px-3 c-file-drag-input__label"
        data-overlay-label
        for="{{ $field->getId() }}">
        <span class="label-text">
            <span class="fa fa-upload"></span>
        </span>
    </label>
</uni-file-drag>

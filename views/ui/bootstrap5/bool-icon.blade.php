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

$type ??= 'solid';
$trueIcon ??= 'fa-check text-success';
$falseIcon ??= 'fa-xmark text-dark';
$size ??= '1x';

/**
 * @var \Windwalker\Edge\Component\ComponentAttributes $attributes
 */
$attributes->class(
    [
        'fa-' . $type,
        'fa-fw',
        'fa-' . ($value ? $trueIcon : $falseIcon),
        'fa-' . $size
    ]
);
?>

<i {{ $attributes->toHtml() }}></i>

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

use Unicorn\Utilities\SlugHelper;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Edge\Component\ComponentAttributes;

use function Windwalker\uid;

/**
 * @var $attributes ComponentAttributes
 */

$props = $attributes->props(
    'active',
    'title',
    'name',
    'id'
);

$title ??= '';
$id ??= $name ?? 'c-tab-' . SlugHelper::slugify($title) ?: 'c-tab-' . uid();
$active = $props->active !== null;

$attributes['id'] = $id;
$attributes['data-role'] = 'tab-pane';
$attributes['data-title'] = $title;

if ($active) {
    $attributes['data-active'] = 1;
}

$attributes = $attributes->class('tab-pane fade');

if ($active) {
    $attributes = $attributes->class('show active');
}
?>

<div {!! $attributes !!}>
    {!! $slot ?? '' !!}
</div>

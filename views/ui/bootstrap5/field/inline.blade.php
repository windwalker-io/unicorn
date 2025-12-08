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
 * @var \Unicorn\Field\InlineField $field
 * @var AppContext $app
 * @var \Windwalker\Form\Form $form
 */

$fields = iterator_to_array($form->getFields());
$countFields = count($fields);
$inputElement = $field->getPreparedInput();
$showLabel = $field->getShowLabel() ?? false;
$i = 0;
$widths = $field->getWidths();
$gap = $field->getGap();

$inputElement->addClass('c-inline-field d-flex flex-wrap w-100');

if ($gap) {
    if (is_numeric($gap)) {
        $gap = ($gap * 0.5) . 'rem';
        $inputElement->style->gap = $gap;
    } else {
        $inputElement->style->gap = $gap;
    }
} else {
    $gap = 0;
}

$labelClass = $showLabel ? '' : 'visually-hidden';
?>

<div {!! $inputElement::buildAttributes($inputElement) !!}>
    @foreach ($fields as $subField)
        <?php
        $w = $widths[$i] ?? null;

        if ($w === null) {
            $style = 'flex: 1 0 0%;';
        } elseif (is_numeric($w)) {
            $w = 100 / 12 * $w;
            $style = "flex: 0 0 auto; width: calc($w% - $gap + ($gap / $countFields));";
        } else {
            $style = "width: calc($w - $gap + ($gap / $countFields));";
        }
        ?>
        <div class="c-inline-field__column" style="{{ $style }}">
            <x-field :field="$subField" :label-class="$labelClass"></x-field>
        </div>
        @php($i++)
    @endforeach
</div>

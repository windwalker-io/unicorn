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
use Windwalker\Core\Form\FormRenderer;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Edge\Component\ComponentAttributes;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Utilities\Str;

/**
 * @var AbstractField $field
 * @var \Windwalker\DOM\DOMElement $input
 * @var array $options
 * @var ComponentAttributes $attributes
 */

$inputElement ??= $field->getPreparedInput();
$options = array_merge($field->getStates(), $options ?? []);

$floating = $field->get('floating') ?? $attributes['floating'] ?? null;

if ($attributes ?? null) {
    $attributes = $attributes->exceptProps(['field', 'options']);
}

if ($inputElement instanceof \Windwalker\DOM\DOMElement) {
    if ($attributes ?? null) {
        $attributes = $attributes->exceptProps(['field', 'options']);

        $attributes = $attributes->merge($inputElement->getAttributes(true), false);
        $inputElement->setAttributes($attributes->getAttributes());
    }

    $inputElement->addClass(
        match (true) {
            $inputElement->getAttribute('type') === 'checkbox' => 'form-input-check',
            $inputElement->getName() === 'select' => 'custom-select form-select',
            default => 'form-control'
        }
    );
}

if ($floating) {
    $inputElement['placeholder'] ??= $field->getLabelName();
}

$fieldElement = $field->buildFieldElement($inputElement, $options);
?>

{!! $fieldElement !!}

@if ($end ?? null)
    {!! $end(field: $field, input: $inputElement) !!}
@endif

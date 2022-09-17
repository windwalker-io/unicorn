<?php

declare(strict_types=1);

namespace App\View;

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

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Form\FormRenderer;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\DOM\DOMFactory;
use Windwalker\Form\Field\AbstractField;

use function Windwalker\DOM\h;

/**
 * @var AbstractField $field
 * @var \Windwalker\DOM\DOMElement $label
 * @var FormRenderer $renderer
 */

$label ??= $field->getPreparedLabel();
$options = array_merge($field->getStates(), $options ?? []);

$label->addClass('form-label');
$label->setAttribute('data-bs-toggle', 'tooltip');
$label->setAttribute('data-toggle', 'tooltip');

if ($desc = $field->get('description')) {
    $label->setAttribute('title', $field->get('description'));

    $label->append(
        DOMFactory::document()->createTextNode(' '),
        h('span', ['class' => 'fa fa-question-circle small'])
    );
}

$labelElement = $field->buildLabel($label, $options);

if ($labelElement instanceof \Windwalker\DOM\DOMElement) {
    if ($attributes ?? null) {
        $attributes = $attributes->exceptProps(['field', 'options']);

        $attributes = $attributes->merge($labelElement->getAttributes(true), false);
        $labelElement->setAttributes($attributes->getAttributes());
    }
}

$label = $field->buildLabel($label, $options);
?>

{!! $labelElement !!}

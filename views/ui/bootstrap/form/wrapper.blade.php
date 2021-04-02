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
use Windwalker\Form\Field\AbstractField;

/**
 * @var AbstractField $field
 * @var \Windwalker\DOM\DOMElement $wrapper
 * @var FormRenderer $renderer
 */

$wrapper->addClass('form-group');
?>

<div {!! \Windwalker\DOM\HTMLElement::buildAttributes($wrapper->getAttributes(true)) !!}>
    {!! $field->renderLabel($options) !!}
    <div data-input-container>
        {!! $field->renderInput($options) !!}
    </div>
</div>

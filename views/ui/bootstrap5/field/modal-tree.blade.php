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

/**
 * @var \App\Field\BoxSelectorField $field
 * @var \Windwalker\DOM\DOMElement $input
 */

$id = $input->getAttribute('id');
$app->service(\Unicorn\Script\UnicornScript::class)
    ->importMainThen(
        <<<JS
u.\$ui.modalTree();
JS
    );

$wrapper = $field->getWrapper();
?>

@if ($field->isMultiple())
    <input id="{{ $field->getId('-empty') }}"
        type="hidden"
        name="{{ $field->getInputName() }}"
        value="{{ $field->get('empty_array_value', '__EMPTY_ARRAY__') }}"
    />
@endif

<div {!! $wrapper::buildAttributes($wrapper) !!}>
    <modal-tree>
        <modal-tree-app {!! $input::buildAttributes($input) !!}></modal-tree-app>
    </modal-tree>
</div>

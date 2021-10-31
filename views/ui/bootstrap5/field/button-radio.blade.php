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

use Unicorn\Field\ButtonRadioField;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Form\FormNormalizer;

/**
 * @var ButtonRadioField $field
 * @var AppContext $app
 */
$inputElement = $field->getPreparedInput();

$uniScript = $app->service(\Unicorn\Script\UnicornScript::class);
$uniScript->importMainThen("u.\$ui.bootstrap.buttonRadio('#{$field->getId()}');");
?>

<div {!! $inputElement::buildAttributes($inputElement) !!}>
    <div class="btn-group">
        @foreach ($field->getOptions() as $option)
            <?php
            $option = clone $option;
            $id = $field->getId('-' . FormNormalizer::clearAttribute($option['value']));
            $checked = (string) $option['value'] === (string) $field->getValue();
            ?>
            <button type="button" class="btn btn-outline-secondary" data-value="{{ $option['value'] }}" data-for="{{ $id }}">
                {!! \Windwalker\DOM\h('span', [], $option->childNodes) !!}
            </button>
        @endforeach
    </div>

    @foreach ($field->getOptions() as $option)
        <?php
        $option = clone $option;
        $option['id'] = $id = $field->getId('-' . FormNormalizer::clearAttribute($option['value']));
        $option['checked'] = $checked = (string) $option['value'] === (string) $field->getValue();
        $option['name'] = $field->getInputName();
        $option['type'] = 'radio';
        $option['disabled'] = $field->isDisabled();
        $option['readonly'] = $field->isReadonly();
        ?>
        <div class="radio" style="display: none;">
            <input type="radio" {!! $option::buildAttributes($option) !!}/>
            <label for="{{ $id }}">
                {!! \Windwalker\DOM\h('span', [], $option->childNodes) !!}
            </label>
        </div>
    @endforeach
</div>

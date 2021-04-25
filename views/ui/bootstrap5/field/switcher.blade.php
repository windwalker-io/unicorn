<?php

declare(strict_types=1);

use Unicorn\Field\SwitcherField;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;

/**
 * @var SwitcherField $field
 * @var AppContext $app
 */

$app->service(UnicornScript::class)->switcher();
$size = $field->getSize();
$color = $field->getColor();
?>

<label class="unicorn-switch {{ $size ? 'switch-' . $size : '' }}"
    for="{{ $field->getId() }}">
    <input id="{{ $field->getId('-unchecked') }}" name="{{ $field->getInputName() }}"
        type="hidden"
        value="{{ $field->getUncheckedValue() ?? '0' }}"
        {{ $field->isDisabled() ? 'disabled="disabled"' : '' }}
    />
    {!! $input !!}
    <span
        class="switch-slider slider-{{ $field->getShape() ?? 'square' }} {{ $color ? 'btn-' . $color : 'btn-secondary' }}"></span>
</label>

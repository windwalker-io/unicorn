<?php

declare(strict_types=1);

namespace Unicorn\Form;

use Windwalker\Core\Form\FormRenderer;
use Windwalker\DOM\HTMLElement;
use Windwalker\Form\Contract\InputOptionsInterface;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Form\Field\SpacerField;
use Windwalker\Form\Field\TextField;

/**
 * The BootstrapFormRenderer class.
 */
class BootstrapFormRenderer extends FormRenderer
{
    public static function handleFieldConfiguration(AbstractField $field): void
    {
        if ($field instanceof SpacerField) {
            $field->wrapperAttr('data-novalidate', true);
            $field->attr('data-novalidate', true);
        }

        if ($field instanceof InputOptionsInterface) {
            $field->setOptionWrapperHandler(
                function (HTMLElement $wrapper) {
                    $wrapper->addClass('form-check');
                    $wrapper->setAttribute('data-input-option', true);
                }
            );
            $field->setOptionHandler(
                function (HTMLElement $wrapper) {
                    $wrapper->addClass('form-check-input');
                }
            );
            $field->setOptionLabelHandler(
                function (HTMLElement $wrapper) {
                    $wrapper->addClass('form-check-label');
                }
            );
            $field->set('validate', ['inputOptions' => true]);
        }
    }

    public static function handleInputClasses(AbstractField $field, HTMLElement $inputElement): void
    {
        $inputElement->addClass(
            match (true) {
                $inputElement->getAttribute('type') === 'checkbox' => 'form-input-check',
                $field instanceof InputOptionsInterface => '',
                strtolower($inputElement->getName()) === 'select' && !$field->hasAttribute('multiple')
                    => 'custom-select form-select',
                $field instanceof TextField => 'form-control',
                default => ''
            }
        );
    }
}

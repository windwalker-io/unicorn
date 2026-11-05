<?php

declare(strict_types=1);

namespace Unicorn\Tests\Form;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Form\BootstrapFormRenderer;
use Windwalker\DOM\HTMLElement;
use Windwalker\Form\Field\CheckboxesField;
use Windwalker\Form\Field\RadioField;
use Windwalker\Form\Field\SpacerField;
use Windwalker\Form\Field\TextField;

/**
 * The BootstrapFormRendererTest class.
 */
final class BootstrapFormRendererTest extends TestCase
{
    #[Test]
    public function spacerFieldGetsNoValidateAttributes(): void
    {
        $field = new SpacerField('spacer');

        BootstrapFormRenderer::handleFieldConfiguration($field);

        self::assertTrue($field->hasAttribute('data-novalidate'));
        self::assertTrue($field->hasWrapperAttribute('data-novalidate'));
    }

    #[Test]
    public function radioFieldGetsBootstrapClasses(): void
    {
        $field = new RadioField('radio');

        BootstrapFormRenderer::handleFieldConfiguration($field);

        self::assertStringContainsString('c-radio-field', (string) $field->getAttribute('class'));
        self::assertStringContainsString('c-radio-field-wrapper', (string) $field->getWrapperAttributes()['class']);
        self::assertSame(['inputOptions' => true], $field->get('validate'));
    }

    #[Test]
    public function checkboxesFieldGetsBootstrapClasses(): void
    {
        $field = new CheckboxesField('checkboxes');

        BootstrapFormRenderer::handleFieldConfiguration($field);

        self::assertStringContainsString('c-checkboxes-field', (string) $field->getAttribute('class'));
        self::assertStringContainsString(
            'c-checkboxes-field-wrapper',
            (string) $field->getWrapperAttributes()['class']
        );
        self::assertSame(['inputOptions' => true], $field->get('validate'));
    }

    #[Test]
    public function textFieldIsNotChangedByConfiguration(): void
    {
        $field = new TextField('text');

        BootstrapFormRenderer::handleFieldConfiguration($field);

        self::assertFalse($field->hasAttribute('data-novalidate'));
        self::assertNull($field->get('validate'));
    }

    #[Test]
    public function checkboxInputGetsCheckClass(): void
    {
        $field = new TextField('text');
        $input = HTMLElement::new('input', ['type' => 'checkbox']);

        BootstrapFormRenderer::handleInputClasses($field, $input);

        self::assertStringContainsString('form-input-check', (string) $input->getAttribute('class'));
    }

    #[Test]
    public function textFieldInputGetsFormControlClass(): void
    {
        $field = new TextField('text');
        $input = HTMLElement::new('input', ['type' => 'text']);

        BootstrapFormRenderer::handleInputClasses($field, $input);

        self::assertStringContainsString('form-control', (string) $input->getAttribute('class'));
    }

    #[Test]
    public function selectInputGetsSelectClassesWhenNotMultiple(): void
    {
        $field = new TextField('select');
        $input = HTMLElement::new('select');

        BootstrapFormRenderer::handleInputClasses($field, $input);

        self::assertStringContainsString('custom-select', (string) $input->getAttribute('class'));
        self::assertStringContainsString('form-select', (string) $input->getAttribute('class'));
        self::assertStringNotContainsString('form-control', (string) $input->getAttribute('class'));
    }

    #[Test]
    public function inputOptionFieldGetsNoExtraClass(): void
    {
        $field = new RadioField('radio');
        $input = HTMLElement::new('input', ['type' => 'radio']);

        BootstrapFormRenderer::handleInputClasses($field, $input);

        self::assertStringNotContainsString('form-control', (string) $input->getAttribute('class'));
        self::assertStringNotContainsString('form-select', (string) $input->getAttribute('class'));
    }
}

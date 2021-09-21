<?php

/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Form\Event;

use Unicorn\Form\FormFieldsBuilder;
use Windwalker\Database\Schema\Ddl\Column;
use Windwalker\Event\AbstractEvent;

/**
 * The BuildFormFieldEvent class.
 */
class BuildFormFieldEvent extends AbstractEvent
{
    protected Column $column;

    protected string $label = '';

    protected ?string $code = null;

    protected FormFieldsBuilder $formFieldsBuilder;

    /**
     * @return Column
     */
    public function getColumn(): Column
    {
        return $this->column;
    }

    /**
     * @param  Column  $column
     *
     * @return  static  Return self to support chaining.
     */
    public function setColumn(Column $column): static
    {
        $this->column = $column;

        return $this;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @param  string  $label
     *
     * @return  static  Return self to support chaining.
     */
    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    /**
     * @return FormFieldsBuilder
     */
    public function getFormFieldsBuilder(): FormFieldsBuilder
    {
        return $this->formFieldsBuilder;
    }

    /**
     * @param  FormFieldsBuilder  $formFieldsBuilder
     *
     * @return  static  Return self to support chaining.
     */
    public function setFormFieldsBuilder(FormFieldsBuilder $formFieldsBuilder): static
    {
        $this->formFieldsBuilder = $formFieldsBuilder;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getCode(): ?string
    {
        return $this->code;
    }

    /**
     * @param  string|null  $code
     *
     * @return  static  Return self to support chaining.
     */
    public function setCode(?string $code): static
    {
        $this->code = $code;

        return $this;
    }
}

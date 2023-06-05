<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Workflow;

/**
 * The State class.
 */
class State
{
    protected string $color = 'dark';

    protected string $icon = '';

    /**
     * State constructor.
     */
    public function __construct(
        protected string $value,
        protected ?string $title = null,
        protected bool $isInitial = false
    ) {
    }

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @param  string  $value
     *
     * @return  static  Return self to support chaining.
     */
    public function setValue(string $value): static
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param  string|null  $title
     *
     * @return  static  Return self to support chaining.
     */
    public function title(?string $title): static
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return bool
     */
    public function isInitial(): bool
    {
        return $this->isInitial;
    }

    /**
     * @param  bool  $isInitial
     *
     * @return  static  Return self to support chaining.
     */
    public function setIsInitial(bool $isInitial): static
    {
        $this->isInitial = $isInitial;

        return $this;
    }

    /**
     * @return string
     */
    public function getColor(): string
    {
        return $this->color;
    }

    /**
     * @param  string  $color
     *
     * @return  static  Return self to support chaining.
     */
    public function color(string $color): static
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @return string
     */
    public function getIcon(): string
    {
        return $this->icon;
    }

    /**
     * @param  string  $icon
     *
     * @return  static  Return self to support chaining.
     */
    public function icon(string $icon): static
    {
        $this->icon = $icon;

        return $this;
    }
}

<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Html\State;

use Windwalker\Utilities\Options\OptionAccessTrait;

/**
 * The StateOption class.
 */
class StateOption
{
    use OptionAccessTrait;

    protected string $value = '';

    protected string $task = '';

    protected string $href = '';

    protected string $onclick = '';

    protected string $icon = 'fa fa-fw fa-question-circle';

    protected string $color = 'dark';

    protected string $title = 'Unknown state';

    protected string $description = '';

    protected bool $onlyIcon = false;

    protected bool $disabled = false;

    protected string $buttonClass = 'btn btn-light';

    protected string $text = '';

    protected string $textColor = '';

    /**
     * StateOption constructor.
     *
     * @param  string  $value
     */
    public function __construct(string $value)
    {
        $this->value = $value;
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
    public function value(string $value): static
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return string
     */
    public function getTask(): string
    {
        return $this->task;
    }

    /**
     * @param  string  $task
     *
     * @return  static  Return self to support chaining.
     */
    public function task(string $task): static
    {
        $this->task = $task;

        return $this;
    }

    /**
     * @return string
     */
    public function getHref(): string
    {
        return $this->href;
    }

    /**
     * @param  string  $href
     *
     * @return  static  Return self to support chaining.
     */
    public function href(string $href): static
    {
        $this->href = $href;

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

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param  string  $title
     *
     * @return  static  Return self to support chaining.
     */
    public function title(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param  string  $description
     *
     * @return  static  Return self to support chaining.
     */
    public function description(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getHelp(): string
    {
        $title = $this->getTitle();

        if ($desc = $this->getDescription()) {
            $title .= ': ' . $desc;
        }

        return $title;
    }

    /**
     * @return bool
     */
    public function isOnlyIcon(): bool
    {
        return $this->onlyIcon;
    }

    /**
     * @param  bool  $onlyIcon
     *
     * @return  static  Return self to support chaining.
     */
    public function onlyIcon(bool $onlyIcon): static
    {
        $this->onlyIcon = $onlyIcon;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDisabled(): bool
    {
        return $this->disabled;
    }

    /**
     * @param  bool  $disabled
     *
     * @return  static  Return self to support chaining.
     */
    public function disabled(bool $disabled): static
    {
        $this->disabled = $disabled;

        return $this;
    }

    /**
     * @return string
     */
    public function getButtonClass(): string
    {
        return $this->buttonClass;
    }

    /**
     * @param  string  $buttonColor
     *
     * @return  static  Return self to support chaining.
     */
    public function buttonClass(string $buttonColor): static
    {
        $this->buttonClass = $buttonColor;

        return $this;
    }

    /**
     * @return string
     */
    public function getText(): string
    {
        return $this->text;
    }

    /**
     * @param  string  $text
     *
     * @return  static  Return self to support chaining.
     */
    public function text(string $text): static
    {
        $this->text = $text;

        return $this;
    }

    /**
     * @return string
     */
    public function getTextColor(): string
    {
        return $this->textColor;
    }

    /**
     * @param  string  $textColor
     *
     * @return  static  Return self to support chaining.
     */
    public function textColor(string $textColor): static
    {
        $this->textColor = $textColor;

        return $this;
    }

    public function merge(array $props): static
    {
        foreach ($props as $name => $value) {
            if ($name === 'options') {
                $this->options = array_merge(
                    $this->options,
                    $value
                );
                continue;
            }

            if (property_exists($this, $name)) {
                $this->$name = $value;
            } else {
                $this->setOption($name, $value);
            }
        }

        return $this;
    }

    /**
     * @return string
     */
    public function getOnclick(): string
    {
        return $this->onclick;
    }

    /**
     * @param  string  $onclick
     *
     * @return  static  Return self to support chaining.
     */
    public function onclick(string $onclick): static
    {
        $this->onclick = $onclick;

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
}

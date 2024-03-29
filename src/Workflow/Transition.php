<?php

declare(strict_types=1);

namespace Unicorn\Workflow;

/**
 * The Transition class.
 */
class Transition
{
    protected string $icon = '';

    protected string $title = '';

    protected string $description = '';

    /**
     * Transition constructor.
     */
    public function __construct(
        protected string $name,
        protected string|array $froms,
        protected string $to,
        protected $enabled = true
    ) {
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param  string  $name
     *
     * @return  static  Return self to support chaining.
     */
    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return array|string
     */
    public function getFroms(): array|string
    {
        return $this->froms;
    }

    /**
     * @param  array|string  $froms
     *
     * @return  static  Return self to support chaining.
     */
    public function setFroms(array|string $froms): static
    {
        $this->froms = $froms;

        return $this;
    }

    /**
     * @return bool
     */
    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    /**
     * @param  bool  $enabled
     *
     * @return  static  Return self to support chaining.
     */
    public function setEnabled(bool $enabled): static
    {
        $this->enabled = $enabled;

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

    public function button(string $icon = '', string $title = '', string $description = ''): static
    {
        return $this->icon($icon)
            ->title($title)
            ->description($description);
    }

    /**
     * @return string
     */
    public function getTo(): string
    {
        return $this->to;
    }

    /**
     * @param  string  $to
     *
     * @return  static  Return self to support chaining.
     */
    public function setTo(string $to): static
    {
        $this->to = $to;

        return $this;
    }
}

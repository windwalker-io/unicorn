<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Workflow;

/**
 * The Transition class.
 */
class Transition
{
    /**
     * Transition constructor.
     */
    public function __construct(
        protected string $name,
        protected string|array $froms,
        protected string|array $tos,
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
     * @return array|string
     */
    public function getTos(): array|string
    {
        return $this->tos;
    }

    /**
     * @param  array|string  $tos
     *
     * @return  static  Return self to support chaining.
     */
    public function setTos(array|string $tos): static
    {
        $this->tos = $tos;

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
}

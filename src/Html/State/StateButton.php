<?php
/**
 * Part of phoenix project.
 *
 * @copyright  Copyright (C) 2016 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

namespace Unicorn\Html\State;

use Windwalker\Utilities\Arr;

/**
 * The StateButton class.
 *
 * @since  1.1
 */
class StateButton
{
    /**
     * Property states.
     *
     * @var  array
     */
    protected array $states = [
        //
    ];

    /**
     * Property options.
     *
     * @var  array
     */
    protected array $options = [];

    /**
     * create
     *
     * @param array $options
     *
     * @return static
     */
    public static function create(array $options = []): static
    {
        return new static($options);
    }

    /**
     * StateButton constructor.
     *
     * @param  array            $options
     *
     */
    public function __construct(array $options = [])
    {
        $this->options = $options;

        $this->init();
    }

    /**
     * configure
     *
     * @return  void
     */
    protected function init(): void
    {
        // Implement this method.
    }

    /**
     * addState
     *
     * @param  string  $value
     *
     * @return StateOption
     */
    public function addState(string $value): StateOption
    {
        // Force type to prevent null data
        return $this->states[$value] = new StateOption($value);
    }

    /**
     * getState
     *
     * @param  string  $value
     *
     * @return StateOption|null
     */
    public function getState(string $value): ?StateOption
    {
        return $this->states[$value] ?? null;
    }

    /**
     * getStates
     *
     * @return  array<StateOption>
     */
    public function getStates(): array
    {
        return $this->states;
    }

    public function getCompiledState(string $value): StateOption
    {
        $state = clone $this->getState($value);

        $state->merge($this->options);

        return $state;
    }

    public function getCompiledStates(): array
    {
        $states = [];

        foreach ($this->getStates() as $value => $state) {
            $states[$value] = $this->getCompiledState($value);
        }

        return $states;
    }

    /**
     * removeState
     *
     * @param  string  $value
     *
     * @return  static
     */
    public function removeState(string $value): static
    {
        if (isset($this->states[$value])) {
            unset($this->states[$value]);
        }

        return $this;
    }

    /**
     * Method to get property Options
     *
     * @return  array
     */
    public function getOptions(): array
    {
        return $this->options;
    }

    /**
     * Method to set property options
     *
     * @param   array $options
     *
     * @return  static  Return self to support chaining.
     */
    public function setOptions(array $options): static
    {
        $this->options = $options;

        return $this;
    }
}
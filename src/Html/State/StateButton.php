<?php
/**
 * Part of phoenix project.
 *
 * @copyright  Copyright (C) 2016 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

namespace Unicorn\Html\State;

use MyCLabs\Enum\Enum;
use Windwalker\Utilities\Options\OptionAccessTrait;

/**
 * The StateButton class.
 *
 * @since  1.1
 */
class StateButton
{
    use OptionAccessTrait;

    /**
     * Property states.
     *
     * @var  array
     */
    protected array $states = [
        //
    ];

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
    public function addState(mixed $value): StateOption
    {
        $value = $this->normalizeValue($value);

        // Force type to prevent null data
        return $this->states[$value] = new StateOption($value, $this->options);
    }

    public function normalizeValue(mixed $value): string
    {
        if ($value instanceof Enum) {
            $value = $value->getValue();
        }

        if ($value === true) {
            $value = '1';
        } elseif ($value === false) {
            $value = '0';
        }

        return (string) $value;
    }

    /**
     * getState
     *
     * @param  string  $value
     *
     * @return StateOption|null
     */
    public function getState(mixed $value): ?StateOption
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

    public function getCompiledState(string $value, array $options = []): StateOption
    {
        $state = clone $this->getState($value);

        $state->merge($options);

        return $state;
    }

    public function getCompiledStates(array $options = []): array
    {
        $states = [];

        foreach ($this->getStates() as $value => $state) {
            $states[$value] = $this->getCompiledState($value, $options);
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
}

<?php

namespace Unicorn\Html\State;

use MyCLabs\Enum\Enum;
use Windwalker\Utilities\Contract\LanguageInterface;
use Windwalker\Utilities\Enum\EnumMetaInterface;
use Windwalker\Utilities\Options\OptionAccessTrait;
use Windwalker\Utilities\TypeCast;

use function Windwalker\unwrap_enum;

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

    public static function fromEnum(string $enumClass, array $options = [], ?LanguageInterface $lang = null): static
    {
        return static::create($options)->addStatesByEnum($enumClass, $lang);
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
     * @param  mixed                   $value
     * @param  LanguageInterface|null  $lang
     *
     * @return StateOption
     */
    public function addState(mixed $value, ?LanguageInterface $lang = null): StateOption
    {
        $rawValue = $this->normalizeValue($value);

        // Force type to prevent null data
        $state = $this->states[$rawValue] = new StateOption($rawValue, $this->options);

        if ($value instanceof EnumMetaInterface) {
            if ($icon = $value->getIcon()) {
                $state->icon($icon);
            }

            if ($title = $value->getTitle($lang)) {
                $state->title($title);
            }
        }

        return $state;
    }

    public function normalizeValue(mixed $value): string
    {
        $value = unwrap_enum($value);

        if ($value === true) {
            $value = '1';
        } elseif ($value === false) {
            $value = '0';
        }

        return TypeCast::toString($value);
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
        return $this->states[$value ?? ''] ?? null;
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
        $state = $this->getState($value);

        if (!$state) {
            throw new \RuntimeException("State with value '{$value}' not found.");
        }

        $state = clone $state;

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

    /**
     * @param  class-string<\BackedEnum>  $enumClass
     * @param  LanguageInterface|null     $lang
     *
     * @return  static
     */
    public function addStatesByEnum(string $enumClass, ?LanguageInterface $lang = null): static
    {
        $cases = $enumClass::cases();

        foreach ($cases as $case) {
            $this->addState($case, $lang);
        }

        return $this;
    }
}

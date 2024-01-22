<?php

declare(strict_types=1);

namespace Unicorn\Component;

use Closure;
use Unicorn\Html\State\StateButton;
use Unicorn\Html\State\StateOption;
use Unicorn\Workflow\WorkflowController;
use Windwalker\Core\Edge\Attribute\EdgeComponent;
use Windwalker\Edge\Component\AbstractComponent;
use Windwalker\Utilities\Attributes\Prop;
use Windwalker\Utilities\Str;
use Windwalker\Utilities\TypeCast;

use function Windwalker\unwrap_enum;

#[EdgeComponent('state-button')]
class StateButtonComponent extends AbstractComponent
{
    #[Prop]
    public mixed $value = '';

    #[Prop]
    public StateButton|WorkflowController|array $states;

    #[Prop]
    public string $store = 'grid';

    #[Prop]
    public string $size = 'sm';

    #[Prop]
    public array $options = [];

    /**
     * @inheritDoc
     */
    public function data(): array
    {
        $this->value = $this->normalizeValue($this->value);

        if ($this->states instanceof WorkflowController) {
            $this->states = $this->states->getStateButton();
        }

        if ($this->states instanceof StateButton) {
            $state = $this->states->getCompiledState($this->value, $this->options);
        } else {
            $state = new StateOption($this->value);
            $state->merge($states[$this->value] ?? []);
            $state->merge($this->options);
        }

        $color = Str::ensureLeft($state->getColor(), 'text-');

        return array_merge(
            parent::data(),
            compact(
                'state',
                'color'
            )
        );
    }

    public function render(): Closure|string
    {
        return '@state-button';
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
}

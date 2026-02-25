<?php

declare(strict_types=1);

namespace Unicorn\Component;

use Closure;
use Windwalker\Core\Edge\Attribute\EdgeComponent;
use Windwalker\Edge\Component\AbstractComponent;
use Windwalker\Utilities\Attributes\Prop;

use function Windwalker\uid;

#[EdgeComponent('tabs')]
class TabsComponent extends AbstractComponent
{
    #[Prop]
    public ?string $id = null;

    /**
     * @var 'tabs'|'pills'
     */
    #[Prop]
    public string $variant = 'tabs';

    #[Prop]
    public mixed $keepactive = null;

    #[Prop]
    public ?bool $fill = null;

    #[Prop]
    public ?string $navTarget = null;

    #[Prop]
    public mixed $navAttrs = [];

    #[Prop]
    public ?int $gap = null;

    #[Prop]
    public ?bool $disabled = null;

    public function data(): array
    {
        $this->getComponentAttributes();

        $this->id ??= 'c-tabs-' . uid();

        if ($this->keepactive === true) {
            $this->keepactive = '#admin-form';
        }

        $this->attributes = $this->attributes->class('sdfsdgf');

        // if ($this->gap) {
        //     $this->attributes = $this->attributes->class("gap-{$this->gap}");
        // }

        $this->attributes['id'] = $this->id;

        $directiveOptions = [
            'variant' => $this->variant,
            'keepactive' => $this->keepactive,
            'fill' => $this->fill,
            'nav-target' => $this->navTarget,
            'nav-attrs' => $this->navAttrs,
            'gap' => $this->gap,
            'disabled' => $this->disabled,
        ];

        $this->attributes['uni-tabs-autonav'] = json_encode($directiveOptions);

        return parent::data();
    }

    public function render(): Closure|string
    {
        return '@tabs';
    }
}

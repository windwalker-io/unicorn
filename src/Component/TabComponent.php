<?php

declare(strict_types=1);

namespace Unicorn\Component;

use Closure;
use Unicorn\Utilities\SlugHelper;
use Windwalker\Core\Edge\Attribute\EdgeComponent;
use Windwalker\Edge\Component\AbstractComponent;
use Windwalker\Utilities\Attributes\Prop;

use function Windwalker\uid;

#[EdgeComponent('tab')]
class TabComponent extends AbstractComponent
{
    #[Prop]
    public bool $active = false;

    #[Prop]
    public string $title = '';

    #[Prop]
    public ?string $name = null;

    #[Prop]
    public ?string $id = null;

    #[Prop]
    public bool $disabled = false;

    public function data(): array
    {
        $this->getComponentAttributes();

        $this->id ??= $this->getDefaultId();

        $this->attributes['id'] = $this->id;
        $this->attributes['data-role'] = 'tab-pane';
        $this->attributes['data-title'] = $this->title;
        $this->attributes['data-disabled'] = $this->disabled ? '1' : '0';

        $this->attributes = $this->attributes->class('tab-pane fade');

        if ($this->active) {
            $this->attributes['data-active'] = '1';

            $this->attributes = $this->attributes->class('show active');
        }

        return parent::data();
    }

    public function render(): Closure|string
    {
        return '@tab';
    }

    public function getDefaultId(): string
    {
        if ($this->name) {
            return $this->name;
        }

        if ($this->title) {
            return 'c-tab-' . SlugHelper::slugify($this->title);
        }

        return 'c-tab-' . uid();
    }
}

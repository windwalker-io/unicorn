<?php

declare(strict_types=1);

namespace Unicorn\Component;

use Closure;
use Windwalker\Core\Edge\Attribute\EdgeComponent;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Core\Router\Navigator;
use Windwalker\Edge\Component\AbstractComponent;
use Windwalker\Utilities\Attributes\Prop;

#[EdgeComponent('basic-pagination')]
class PaginationComponent extends AbstractComponent
{
    use TranslatorTrait;

    #[Prop]
    public Pagination $pagination;

    #[Prop]
    public array|bool|null $allowQuery = null;

    #[Prop]
    public bool $inModal = false;

    public function data(): array
    {
        $data = parent::data();

        /** @var Pagination $pagination */
        $pagination = $data['pagination'];

        $pagination->allowQuery($this->allowQuery);

        if ($this->inModal) {
            $pagination->configureNavigator(
                function (Navigator $nav) {
                    return $nav->allowQuery(['layout', 'callback', 'multiCheck', 'selected']);
                }
            );
        }

        return $data;
    }

    public function render(): Closure|string
    {
        return '@pagination';
    }
}

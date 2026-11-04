<?php

declare(strict_types=1);

namespace Unicorn\Tests\Component;

use Closure;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Component\PaginationComponent;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Core\Router\Navigator;

final class PaginationComponentTest extends TestCase
{
    #[Test]
    public function parsesAllowedQueryNamesAndAddsModalQueryNames(): void
    {
        $pagination = $this->createMock(Pagination::class);
        $pagination->expects($this->once())
            ->method('allowQuery')
            ->with(['filter', 'sort'])
            ->willReturnSelf();

        $navigator = $this->createMock(Navigator::class);
        $navigator->expects($this->once())
            ->method('allowQuery')
            ->with(['layout', 'callback', 'multiCheck', 'selected'])
            ->willReturnSelf();
        $pagination->expects($this->once())
            ->method('configureNavigator')
            ->with($this->callback(static function (Closure $configure) use ($navigator): bool {
                $configure($navigator);

                return true;
            }))
            ->willReturnSelf();

        $component = new PaginationComponent();
        $component->pagination = $pagination;
        $component->allowQuery = 'filter, sort';
        $component->inModal = true;

        self::assertSame($pagination, $component->data()['pagination']);
    }

    #[Test]
    public function passesNonStringAllowedQueryValueThrough(): void
    {
        $pagination = $this->createMock(Pagination::class);
        $pagination->expects($this->once())
            ->method('allowQuery')
            ->with(false)
            ->willReturnSelf();
        $pagination->expects($this->never())->method('configureNavigator');

        $component = new PaginationComponent();
        $component->pagination = $pagination;
        $component->allowQuery = false;

        $component->data();
    }

    #[Test]
    public function resolvesThePaginationView(): void
    {
        self::assertSame('@pagination', new PaginationComponent()->render());
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Tests\Html;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Html\Breadcrumb;
use Windwalker\Core\Renderer\RendererService;

/**
 * @covers \Unicorn\Html\Breadcrumb
 */
final class BreadcrumbTest extends TestCase
{
    private function createBreadcrumb(?RendererService $renderer = null): Breadcrumb
    {
        return new Breadcrumb($renderer ?? $this->createStub(RendererService::class));
    }

    #[Test]
    public function pushAppendsItem(): void
    {
        $bc = $this->createBreadcrumb();
        $bc->push('Home', '/home', true, ['class' => 'x']);

        self::assertSame(
            [
                [
                    'title' => 'Home',
                    'link' => '/home',
                    'active' => true,
                    'attrs' => ['class' => 'x'],
                ],
            ],
            $bc->getItems()
        );
    }

    #[Test]
    public function pushDefaults(): void
    {
        $bc = $this->createBreadcrumb();
        $bc->push('Home');

        $item = $bc->get(0);

        self::assertSame('Home', $item['title']);
        self::assertNull($item['link']);
        self::assertFalse($item['active']);
        self::assertSame([], $item['attrs']);
    }

    #[Test]
    public function popRemovesLastItem(): void
    {
        $bc = $this->createBreadcrumb();
        $bc->push('A');
        $bc->push('B');

        $item = $bc->pop();

        self::assertSame('B', $item['title']);
        self::assertCount(1, $bc->getItems());
    }

    #[Test]
    public function popOnEmptyReturnsNull(): void
    {
        $bc = $this->createBreadcrumb();

        self::assertNull($bc->pop());
    }

    #[Test]
    public function getAndSet(): void
    {
        $bc = $this->createBreadcrumb();
        $bc->push('A');

        $bc->set(0, ['title' => 'Changed', 'link' => null, 'active' => false, 'attrs' => []]);

        self::assertSame('Changed', $bc->get(0)['title']);
        self::assertNull($bc->get('missing'));
    }

    #[Test]
    public function mapReturnsNewInstanceWithTransformedItems(): void
    {
        $bc = $this->createBreadcrumb();
        $bc->push('A');
        $bc->push('B');

        $mapped = $bc->map(
            static fn (array $item): array => array_merge($item, ['title' => strtoupper($item['title'])])
        );

        self::assertNotSame($bc, $mapped);
        self::assertInstanceOf(Breadcrumb::class, $mapped);
        self::assertSame('A', $bc->get(0)['title']);
        self::assertSame('A', $mapped->get(0)['title']);
        self::assertSame('B', $mapped->get(1)['title']);
    }

    #[Test]
    public function iteratorYieldsAllItems(): void
    {
        $bc = $this->createBreadcrumb();
        $bc->push('A');
        $bc->push('B');

        $titles = [];

        foreach ($bc->getIterator() as $item) {
            $titles[] = $item['title'];
        }

        self::assertSame(['A', 'B'], $titles);
    }

    #[Test]
    public function renderPassesSelfToRenderer(): void
    {
        $renderer = $this->createMock(RendererService::class);
        $renderer->expects($this->once())
            ->method('render')
            ->with('@theme::components.breadcrumb', $this->callback(
                fn (array $params): bool => ($params['breadcrumb'] ?? null) instanceof Breadcrumb
                    && ($params['foo'] ?? null) === 'bar'
            ))
            ->willReturn('<nav>rendered</nav>');

        $bc = $this->createBreadcrumb($renderer);

        self::assertSame('<nav>rendered</nav>', $bc->render(['foo' => 'bar']));
    }

    #[Test]
    public function toStringRenders(): void
    {
        $renderer = $this->createMock(RendererService::class);
        $renderer->expects($this->once())
            ->method('render')
            ->willReturn('<nav>str</nav>');

        $bc = $this->createBreadcrumb($renderer);

        self::assertSame('<nav>str</nav>', (string) $bc);
    }
}

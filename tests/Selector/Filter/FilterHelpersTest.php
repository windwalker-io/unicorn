<?php

declare(strict_types=1);

namespace Unicorn\Tests\Selector\Filter;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Selector\Filter\FilterHelper;
use Unicorn\Selector\Filter\OrderingHelper;
use Unicorn\Selector\Filter\SearchHelper;
use Windwalker\Query\Query;

class FilterHelpersTest extends TestCase
{
    #[Test]
    public function filterDefaultHandlerUsesEqualsAndIn(): void
    {
        $calls = [];
        $query = $this->createMock(Query::class);
        $query->expects($this->exactly(2))
            ->method('where')
            ->willReturnCallback(function (...$args) use (&$calls, $query) {
                $calls[] = $args;

                return $query;
            });

        $result = (new FilterHelper())->process(
            $query,
            ['foo' => 'bar', 'empty' => '', 'emptyArr' => [], 'ids' => [1, 2]]
        );

        $this->assertSame($query, $result);
        $this->assertSame([['foo', '=', 'bar'], ['ids', 'in', [1, 2]]], $calls);
    }

    #[Test]
    public function filterObjectValueIsConvertedToArray(): void
    {
        $query = $this->createMock(Query::class);
        $query->expects($this->once())
            ->method('where')
            ->with('f', 'in', ['a' => 1])
            ->willReturnSelf();

        (new FilterHelper())->process($query, ['f' => (object) ['a' => 1]]);
    }

    #[Test]
    public function filterCustomHandlerAndFalseSkip(): void
    {
        $query = $this->createMock(Query::class);
        $query->expects($this->once())
            ->method('where')
            ->with('b', '<=', 5)
            ->willReturnSelf();

        $helper = new FilterHelper();
        $helper->addHandler('a', false)
            ->addHandler('b', fn(Query $q, $f, $v) => $q->where($f, '<=', $v));

        $helper->process($query, ['a' => 1, 'b' => 5]);
    }

    #[Test]
    public function filterSetDefaultHandler(): void
    {
        $query = $this->createMock(Query::class);
        $query->expects($this->never())->method('where');
        $called = [];

        $helper = new FilterHelper();
        $helper->setDefaultHandler(function ($q, $f, $v) use (&$called) {
            $called[] = [$f, $v];
        });
        $helper->process($query, ['x' => 1]);

        $this->assertSame([['x', 1]], $called);
    }

    #[Test]
    public function searchWrapsInOrWhereWithLike(): void
    {
        $inner = $this->createMock(Query::class);
        $inner->expects($this->once())
            ->method('where')
            ->with('title', 'like', '%hello%')
            ->willReturnSelf();

        $query = $this->createMock(Query::class);
        $query->expects($this->once())
            ->method('orWhere')
            ->willReturnCallback(function (callable $cb) use ($inner, $query) {
                $cb($inner);

                return $query;
            });

        $helper = new SearchHelper();
        $helper->addHandler('skip', false);

        $result = $helper->process($query, [
            'title' => 'hello',
            '*' => 'hello',
            'empty' => '',
            'skip' => 'x',
        ]);

        $this->assertSame($query, $result);
    }

    #[Test]
    public function orderingDefaultHandlerWrapsFunctionsAsRaw(): void
    {
        $calls = [];
        $query = $this->createMock(Query::class);
        $query->expects($this->exactly(2))
            ->method('order')
            ->willReturnCallback(function ($order, $dir) use (&$calls, $query) {
                $calls[] = [$order, $dir];

                return $query;
            });

        (new OrderingHelper())->process($query, [
            'a' => ['id', 'DESC'],
            'b' => ['RAND()', 'ASC'],
        ]);

        $this->assertSame(['id', 'DESC'], $calls[0]);
        $this->assertNotSame('RAND()', $calls[1][0]);
        $this->assertSame('ASC', $calls[1][1]);
    }

    #[Test]
    public function orderingHandlerFalseSkips(): void
    {
        $query = $this->createMock(Query::class);
        $query->expects($this->never())->method('order');

        $helper = new OrderingHelper();
        $helper->addHandler('a', false);
        $helper->process($query, ['a' => ['id', 'ASC']]);
    }
}

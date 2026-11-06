<?php

declare(strict_types=1);

namespace Unicorn\Tests\Selector;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Selector\ListSelector;
use Windwalker\Core\Testing\Traits\InMemoryDatabaseTestTrait;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\ORM\SelectorQuery;

/**
 * Integration tests for ListSelector against SQLite :memory:.
 */
class ListSelectorTest extends TestCase
{
    use InMemoryDatabaseTestTrait;

    protected function prepareInMemoryDatabaseSchema(DatabaseAdapter $db): void
    {
        $db->execute(
            'CREATE TABLE selector_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(255) NOT NULL,
                state INTEGER NOT NULL DEFAULT 1,
                ordering INTEGER NOT NULL DEFAULT 0
            )',
        );

        $rows = [
            ['Apple pie', 1, 3],
            ['Banana split', 1, 1],
            ['Cherry tart', 0, 2],
            ['Apple tart', 1, 4],
            ['Date cake', 0, 5],
        ];

        foreach ($rows as [$title, $state, $ordering]) {
            $db->execute(
                'INSERT INTO selector_items (title, state, ordering) VALUES (?, ?, ?)',
                [$title, $state, $ordering]
            );
        }
    }

    private function selector(): ListSelector
    {
        $selector = new ListSelector($this->db);
        $selector->modifyQuery(fn(SelectorQuery $q) => $q->from('selector_items'));
        $selector->setAllowFields(['id', 'title', 'state', 'ordering']);
        $selector->disableAutoSelect();

        return $selector;
    }

    private function titles(ListSelector $selector): array
    {
        return array_map(static fn($row) => $row['title'] ?? $row->title, $selector->all()->dump());
    }

    #[Test]
    public function allReturnsEveryRow(): void
    {
        $this->assertCount(5, $this->selector()->all());
    }

    #[Test]
    public function filtersByEqualsAndIn(): void
    {
        $this->assertCount(3, $this->selector()->addFilter('state', 1)->all());
        $this->assertCount(2, $this->selector()->addFilter('id', [1, 2])->all());
    }

    #[Test]
    public function filterIgnoresDisallowedFieldAndEmptyValue(): void
    {
        $this->assertCount(5, $this->selector()->addFilter('nope', 1)->addFilter('state', '')->all());
    }

    #[Test]
    public function fieldAliasResolvesFilter(): void
    {
        $selector = $this->selector()->fieldAlias('published', 'state')->addFilter('published', 0);

        $this->assertCount(2, $selector->all());
    }

    #[Test]
    public function searchesWithLikeOnFields(): void
    {
        $selector = $this->selector()->searchTextFor('tart', ['title']);

        $this->assertEqualsCanonicalizing(['Cherry tart', 'Apple tart'], $this->titles($selector));
    }

    #[Test]
    public function addSearchAndHasSearch(): void
    {
        $selector = $this->selector()->addSearch('title', 'Apple');

        $this->assertTrue($selector->hasSearch('title'));
        $this->assertFalse($selector->hasSearch('state'));
        $this->assertCount(2, $selector->all());
    }

    #[Test]
    public function orderingAppliesDirection(): void
    {
        $selector = $this->selector()->ordering('ordering DESC');

        $this->assertSame(
            ['Date cake', 'Apple tart', 'Apple pie', 'Cherry tart', 'Banana split'],
            $this->titles($selector)
        );
    }

    #[Test]
    public function defaultOrderingUsedWhenNoOrderSet(): void
    {
        $selector = $this->selector()->defaultOrdering('title DESC');

        $this->assertSame('Date cake', $this->titles($selector)[0]);
    }

    #[Test]
    public function limitAndPageSliceResults(): void
    {
        $selector = $this->selector()->ordering('id ASC')->limit(2)->page(2);

        $this->assertSame(['Cherry tart', 'Apple tart'], $this->titles($selector));
        $this->assertSame(5, $selector->count());
    }

    #[Test]
    public function pageFixClampsOutOfRangePage(): void
    {
        $selector = $this->selector()->ordering('id ASC')->limit(2)->page(99);

        $this->assertSame(['Date cake'], $this->titles($selector));
    }

    #[Test]
    public function countRespectsFilters(): void
    {
        $this->assertSame(2, $this->selector()->addFilter('state', 0)->count());
    }

    #[Test]
    public function countCallbackOverridesCount(): void
    {
        $selector = $this->selector()->setCountCallback(fn() => 42);

        $this->assertSame(42, $selector->count());
    }

    #[Test]
    public function getReturnsFirstRowOrNull(): void
    {
        $this->assertNotNull($this->selector()->ordering('id ASC')->get());
        $this->assertNull($this->selector()->addFilter('id', 999)->get());
    }

    #[Test]
    public function allowFieldAndHasFilterHelpers(): void
    {
        $selector = $this->selector();
        $selector->allowField('title', 'name');

        $this->assertTrue($selector->isFieldAllow('title'));
        $this->assertFalse($selector->isFieldAllow('unknown'));

        $selector->addFilter('state', 1);
        $this->assertTrue($selector->hasFilter('state'));
        $this->assertSame(1, $selector->getFilter('state'));
    }

    #[Test]
    public function cloneHasIndependentQuery(): void
    {
        $selector = $this->selector();
        $selector->getQuery();
        $clone = clone $selector;

        $this->assertNotSame($selector->getQuery(), $clone->getQuery());
    }

    #[Test]
    public function cloneResetsCache(): void
    {
        $selector = $this->selector();
        $this->assertSame(5, $selector->count());

        $clone = clone $selector;
        $clone->addFilter('state', 0);

        $this->assertSame(2, $clone->count());
        $this->assertSame(5, $selector->count());
    }

    #[Test]
    public function multipleSearchWordsMustAllMatch(): void
    {
        $selector = $this->selector()->fuzzySearchTextFor('apple tart', ['title']);

        $this->assertSame(['Apple tart'], $this->titles($selector));
    }

    #[Test]
    public function multipleSearchWordsMatchAcrossFields(): void
    {
        $selector = $this->selector()->searchTextFor(['cherry', '2'], ['title', 'ordering']);

        $this->assertSame(['Cherry tart'], $this->titles($selector));
    }

    #[Test]
    public function allowFieldWithoutAliasDoesNotFail(): void
    {
        $selector = $this->selector()->allowField('extra');

        $this->assertTrue($selector->isFieldAllow('extra'));
    }

    #[Test]
    public function getPageDefaultsAndDerivesFromOffset(): void
    {
        $selector = $this->selector();
        $this->assertSame(1, $selector->getPage());

        $selector = $this->selector()->limit(2)->offset(2);
        $this->assertSame(2, $selector->getPage());

        $selector = $this->selector()->limit(2)->offset(3);
        $this->assertSame(2, $selector->getPage());
    }

    #[Test]
    public function getPaginationRequiresFactory(): void
    {
        $this->expectException(\LogicException::class);

        $this->selector()->getPagination();
    }

    #[Test]
    public function offsetWithoutLimitDoesNotDivideByZero(): void
    {
        $selector = $this->selector()->offset(100);

        $this->assertSame(100, $selector->getOffset());
    }

    #[Test]
    public function settersInvalidateCachedValues(): void
    {
        $selector = $this->selector();
        $this->assertSame(5, $selector->count());

        $selector->addFilter('state', 0);
        $this->assertSame(2, $selector->count());

        $selector->setFilters([]);
        $this->assertSame(5, $selector->count());

        $selector->limit(2)->page(2);
        $this->assertSame(2, $selector->getOffset());
        $selector->page(1);
        $this->assertSame(0, $selector->getOffset());
    }

    #[Test]
    public function addAllowFieldsAfterReadIsEffective(): void
    {
        $selector = $this->selector();
        $this->assertFalse($selector->isFieldAllow('extra'));

        $selector->addAllowFields('extra');
        $this->assertTrue($selector->isFieldAllow('extra'));
    }

    #[Test]
    public function orderingKeepsSortDirectionEnum(): void
    {
        $selector = $this->selector()->ordering('id', \SortDirection::Descending);

        $this->assertSame('Date cake', $this->titles($selector)[0]);
        $this->assertStringContainsString('DESC', $selector->compileQuery()->getOrder()->render());
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Lyrasoft\Luna\Entity\Category;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\DOMElement;
use Windwalker\ORM\NestedSetMapper;
use Windwalker\Query\Query;

/**
 * The CategoryCascadeSelectField class.
 */
class CategoryCascadeSelectField extends CascadeSelectField
{
    use DatabaseAwareTrait;

    #[Inject]
    protected Navigator $nav;

    protected string $categoryType;

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        if (!$this->getAjaxUrl()) {
            $this->ajaxUrl($this->nav->to('category_ajax_list')->var('type', $this->getCategoryType()));
        }

        return parent::buildFieldElement($input, $options);
    }

    /**
     * @return string
     */
    public function getCategoryType(): string
    {
        return $this->categoryType;
    }

    /**
     * @param  string  $categoryType
     *
     * @return  static  Return self to support chaining.
     */
    public function categoryType(string $categoryType): static
    {
        $this->categoryType = $categoryType;

        return $this;
    }

    protected function getValuePath(mixed $value): array
    {
        if (!$value) {
            return [];
        }

        $db = $this->getDb();
        $orm = $db->orm();

        /** @var NestedSetMapper $mapper */
        $mapper = $orm->mapper(Category::class);

        return $mapper->getPath($value)->removeFirst()
            ->column($this->getValueField())
            ->dump();
    }

    protected function prepareQuery(Query $query): void
    {
    }
}

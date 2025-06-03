<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Lyrasoft\Luna\Tree\NodeInterface;
use Lyrasoft\Luna\Tree\TreeBuilder;
use Windwalker\Data\Collection;
use Windwalker\DOM\HTMLElement;
use Windwalker\Utilities\Arr;

use function Lyrasoft\ShopGo\Field\str_contains;
use function Windwalker\DOM\h;
use function Windwalker\value_compare;

/**
 * The FlatListField class.
 */
class FlatListField extends SqlListField
{
    use LayoutFieldTrait;

    protected ?string $inputType = null;

    protected ?\Closure $treeBuilder = null;

    public function getDefaultLayout(): string
    {
        return '@theme::field.flat-list.flat-list';
    }

    public function getTree(): NodeInterface
    {
        $items = $this->getItems();

        return $this->getTreeBuilder()(Collection::from($items), $this);
    }

    public function compileFieldElement(HTMLElement $input, array $options = []): string|HTMLElement
    {
        $tree = $this->getTree();

        return $this->renderLayout(
            $this->getLayout(),
            [
                'field' => $this,
                'input' => $input,
                'options' => $options,
                'tree' => $tree
            ]
        );
    }

    public function createItemOption(object $item): HTMLElement
    {
        $textField = $this->getTextField() ?? $this->textField;
        $valueField = $this->getValueField() ?? $this->valueField;

        $text = $item->$textField ?? null;
        $value = $item->$valueField ?? null;

        $values = $this->getNormalizedValues();

        $attrs = $this->getOptionAttrs() ?? [];

        $inputType = $this->getInputType();

        if (!$inputType) {
            $inputType = $this->isMultiple() ? 'checkbox' : 'radio';
        }

        $id = $this->getId('--' . $value);

        $attrs['type'] = $inputType;
        $attrs['id'] = $id;
        $attrs['name'] = $this->getInputName('[]');
        $attrs['value'] = $value;
        $attrs['data-label'] = $text;

        // Use non-strict compare
        if (value_compare($value, $values, 'in')) {
            $attrs['checked'] = true;
        }

        return h('input', $attrs);
    }

    /**
     * @return \Closure|null
     */
    public function getTreeBuilder(): ?\Closure
    {
        return $this->treeBuilder ?: static fn(Collection $items) => TreeBuilder::create($items);
    }

    /**
     * @param  \Closure|null  $treeBuilder
     *
     * @return  static  Return self to support chaining.
     */
    public function treeBuilder(?\Closure $treeBuilder): static
    {
        $this->treeBuilder = $treeBuilder;

        return $this;
    }

    /**
     * @return  array<string|int>
     */
    protected function getNormalizedValues(): array
    {
        $values = $this->getValue();

        if (is_string($values) && str_contains($values, ',')) {
            $values = Arr::explodeAndClear(',', $values);
        }

        if (is_json($values)) {
            $values = (array) json_decode($values, true);
        }

        return (array) $values;
    }

    /**
     * @return ?string
     */
    public function getInputType(): ?string
    {
        return $this->inputType;
    }

    /**
     * @param  string|null  $inputType
     *
     * @return  static  Return self to support chaining.
     */
    public function inputType(?string $inputType): static
    {
        $this->inputType = $inputType;

        return $this;
    }
}

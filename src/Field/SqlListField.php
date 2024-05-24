<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Core\Manager\DatabaseManager;
use Windwalker\Data\Collection;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\ListField;
use Windwalker\ORM\SelectorQuery;
use Windwalker\Query\Query;

/**
 * The SqlListField class.
 *
 * @method $this textField(mixed $value = null)
 * @method string getTextField()
 * @method $this valueField(mixed $value = null)
 * @method string getValueField()
 * @method $this optionAttrs(array $value = null)
 * @method array getOptionAttrs()
 */
class SqlListField extends ListField
{
    use DatabaseAwareTrait;

    protected ?string $textField = 'title';

    protected ?string $valueField = 'id';

    protected ?\Closure $groupBy = null;

    protected string $indentByField = 'level';

    protected function prepareQuery(Query $query): void
    {
    }

    public function getItems(): iterable
    {
        return $this->compileQuery();
    }

    protected function prepareOptions(): array
    {
        $options = parent::prepareOptions();

        $table = $this->getTable() ?? $this->table;

        if (!$table) {
            return [];
        }

        $groupHandler = $this->getGroupBy();

        foreach ($this->getItems() as $item) {
            $group = null;

            if ($groupHandler) {
                $group = $groupHandler($item, $this);
            }

            if ($group) {
                $options[$group] ??= [];
                $options[$group][] = $this->createItemOption($item);
            } else {
                $options[] = $this->createItemOption($item);
            }
        }

        return $options;
    }

    public function createItemOption(object $item): DOMElement
    {
        $textField = $this->getTextField() ?? $this->textField;
        $valueField = $this->getValueField() ?? $this->valueField;

        $text = $item->$textField ?? null;
        $value = $item->$valueField ?? null;

        $level = $this->getIndentLevel($item);

        return static::createOption(str_repeat('- ', $level) . $text, $value, $this->getOptionAttrs() ?? []);
    }

    public function getGroupBy(): ?\Closure
    {
        return $this->groupBy;
    }

    /**
     * @param  \Closure|null  $groupBy
     *
     * @return  static  Return self to support chaining.
     */
    public function setGroupBy(?\Closure $groupBy): static
    {
        $this->groupBy = $groupBy;

        return $this;
    }

    /**
     * getAccessors
     *
     * @return  array
     *
     * @since   1.3.2
     */
    protected function getAccessors(): array
    {
        return array_merge(parent::getAccessors(), [
            'table',
            'textField',
            'valueField',
            'optionAttrs'
        ]);
    }

    public function getIndentByField(): string
    {
        return $this->indentByField;
    }

    public function indentByField(string $indentByField): static
    {
        $this->indentByField = $indentByField;

        return $this;
    }

    /**
     * @param  object  $item
     *
     * @return  int
     */
    protected function getIndentLevel(object $item): int
    {
        $indentField = $this->getIndentByField();

        $level = 0;

        if (!empty($item->$indentField)) {
            $level = ((int) $item->$indentField) - 1;
        }

        if ($level < 0) {
            $level = 0;
        }

        return $level;
    }
}

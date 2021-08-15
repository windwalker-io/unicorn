<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

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

        foreach ($this->getItems() as $item) {
            $options[] = $this->createItemOption($item);
        }

        return $options;
    }

    public function createItemOption(object $item): DOMElement
    {
        $textField = $this->getTextField() ?? $this->textField;
        $valueField = $this->getValueField() ?? $this->valueField;

        $text = $item->$textField ?? null;
        $value = $item->$valueField ?? null;

        $level = !empty($item->level) ? $item->level - 1 : 0;

        if ($level < 0) {
            $level = 0;
        }

        return static::createOption(str_repeat('- ', $level) . $text, $value, $this->getOptionAttrs() ?? []);
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
}

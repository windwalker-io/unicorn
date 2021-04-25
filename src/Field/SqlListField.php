<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
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
 * @method $this table(mixed $value = null)
 * @method string getTable()
 * @method $this textField(mixed $value = null)
 * @method string getTextField()
 * @method $this valueField(mixed $value = null)
 * @method string getValueField()
 * @method $this optionAttrs(array $value = null)
 * @method array getOptionAttrs()
 * @method $this connection(string $value = null)
 * @method string getConnection()
 */
class SqlListField extends ListField
{
    #[Inject]
    protected DatabaseManager $dbManager;

    protected ?string $table = null;

    protected ?string $textField = 'title';

    protected ?string $valueField = 'id';

    protected ?Query $query = null;

    public function getDb(): DatabaseAdapter
    {
        $connection = $this->getConnection();

        if ($connection instanceof DatabaseAdapter) {
            return $connection;
        }

        return $this->dbManager->get($connection);
    }

    public function configureQuery(callable $handler): static
    {
        $query = $handler($this->getQuery());

        if ($query !== null) {
            $this->setQuery($query);
        }

        return $this;
    }

    public function createQuery(): SelectorQuery
    {
        $query = $this->getDb()->orm()->select();

        return $query->from($this->getTable() ?? $this->table);
    }

    /**
     * @return Query
     */
    public function getQuery(): Query
    {
        return $this->query ??= $this->createQuery();
    }

    /**
     * @param  Query|null  $query
     *
     * @return  static  Return self to support chaining.
     */
    public function setQuery(?Query $query): static
    {
        $this->query = $query;

        return $this;
    }

    public function getItems(): iterable
    {
        $this->prepareQuery($query = $this->getQuery());

        return $query;
    }

    protected function prepareQuery(Query $query): void
    {
        //
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
            'optionAttrs',
            'connection',
        ]);
    }
}

<?php

namespace Unicorn\Selector\Filter;

use Windwalker\Query\Query;

use Windwalker\Utilities\Str;

use function Windwalker\raw;
use function Windwalker\value;

class OrderingHelper extends AbstractFilterHelper
{
    /**
     * Execute the filter and add in query object.
     *
     * @param   Query  $query  Db query object.
     * @param   array  $data   The data from request.
     *
     * @return  Query  Return the query object.
     */
    public function process(Query $query, array $data = []): Query
    {
        foreach ($data as $name => [$field, $dir]) {
            // If handler is FALSE, means skip this field.
            if (array_key_exists($name, $this->handler) && $this->handler[$name] === false) {
                continue;
            }

            if (!empty($this->handler[$name]) && is_callable($this->handler[$name])) {
                $this->handler[$name]($query, $field, $dir);
            } else {
                $handler = $this->defaultHandler;

                /** @see self::getDefaultHandler() */
                $handler($query, $field, $dir);
            }
        }

        return $query;
    }

    /**
     * Register the default handler.
     *
     * @return  callable The handler callback.
     */
    protected function getDefaultHandler(): callable
    {
        /**
         * Default handler closure.
         *
         * @param   Query  $query The query object.
         * @param   string $field The field name.
         * @param   mixed  $value The filter value.
         *
         * @return  Query
         */
        return function (Query $query, string $order, ?string $dir) {
            if (is_string($order) && Str::endsWith($order, ')')) {
                $order = raw($order);
            }

            $query->order($order, $dir);
        };
    }
}

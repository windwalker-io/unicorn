<?php
/**
 * Part of Phoenix project.
 *
 * @copyright  Copyright (C) 2011 - 2014 SMS Taiwan, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE
 */

namespace Unicorn\Selector\Filter;

use Windwalker\Query\Query;

/**
 * Filter helper.
 *
 * @since 1.0
 */
class FilterHelper extends AbstractFilterHelper
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
        foreach ($data as $field => $value) {
            // If handler is FALSE, means skip this field.
            if (array_key_exists($field, $this->handler) && $this->handler[$field] === false) {
                continue;
            }

            if (!empty($this->handler[$field]) && is_callable($this->handler[$field])) {
                $this->handler[$field]($query, $field, $value);
            } else {
                $handler = $this->defaultHandler;

                /** @see FilterHelper::getDefaultHandler() */
                $handler($query, $field, $value);
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
        return function (Query $query, string $field, mixed $value) {
            if (is_object($value)) {
                $value = get_object_vars($value);
            }

            // Filter array IN()
            if (is_array($value)) {
                if ($value !== []) {
                    $query->where($field, 'in', $value);
                }

                return $query;
            }

            if ((string) $value !== '') {
                // Filter String
                $query->where($field, '=', $value);
            }

            return $query;
        };
    }
}

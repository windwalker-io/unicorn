<?php
/**
 * Part of Phoenix project.
 *
 * @copyright  Copyright (C) 2011 - 2014 SMS Taiwan, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE
 */

namespace Unicorn\Repository\Filter;

/**
 * Abstract Filter Helper
 *
 * @since 1.0
 */
abstract class AbstractFilterHelper implements FilterHelperInterface
{
    /**
     * Handler callbacks.
     *
     * @var  array<callable|false>
     */
    protected array $handler = [];

    /**
     * The default handler.
     *
     * @var  callable
     */
    protected $defaultHandler;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->defaultHandler = $this->getDefaultHandler();
    }

    /**
     * Set filter handler. Can be a callback or closure.
     *
     * Example:
     * ``` php
     * function(Query $query, $field, $value) {
     *     return $query->where($field, '<=', $value);
     * }
     * ```
     *
     * @param  string         $name     The handler name.
     * @param  callable|bool  $handler  Handler callback.
     *
     * @return  AbstractFilterHelper Return self to support chaining.
     */
    public function addHandler(string $name, callable|bool $handler): static
    {
        $this->handler[$name] = $handler;

        return $this;
    }

    /**
     * Register the default handler.
     *
     * @return  callable The handler callback.
     */
    abstract protected function getDefaultHandler(): callable;

    /**
     * Set default handler.
     *
     * @param   callable $defaultHandler The default handler.
     *
     * @return  static  Return self to support chaining.
     */
    public function setDefaultHandler(callable $defaultHandler): static
    {
        $this->defaultHandler = $defaultHandler;

        return $this;
    }
}

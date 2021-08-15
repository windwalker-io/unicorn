<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Html;

use Psr\Http\Message\UriInterface;
use Windwalker\Core\Renderer\RendererService;

/**
 * The Breadcrumb class.
 */
class Breadcrumb
{
    /**
     * Property items.
     *
     * @var array
     */
    protected array $items = [];

    /**
     * BreadcrumbManager constructor.
     *
     * @param  RendererService  $rendererService
     */
    public function __construct(protected RendererService $rendererService)
    {
        //
    }

    /**
     * addPath
     *
     * @param  string  $title
     * @param  string|UriInterface|null  $link
     * @param  bool  $active
     * @param  array  $attrs
     *
     * @return  static
     */
    public function push(
        string $title,
        string|UriInterface $link = null,
        bool $active = false,
        array $attrs = []
    ): static {
        $this->items[] = [
            'title' => $title,
            'link' => $link,
            'active' => $active,
            'attrs' => $attrs,
        ];

        return $this;
    }

    /**
     * pop
     *
     * @return  array
     *
     * @since  3.3
     */
    public function pop(): array
    {
        return array_pop($this->items);
    }

    /**
     * get
     *
     * @param  string|int  $key
     *
     * @return array|null
     * @since  3.3
     */
    public function get(mixed $key): ?array
    {
        return $this->items[$key] ?? null;
    }

    /**
     * set
     *
     * @param  string|int  $key
     * @param  array       $item
     *
     * @return  static
     *
     * @since  3.3
     */
    public function set(mixed $key, array $item): static
    {
        $this->items[$key] = $item;

        return $this;
    }

    /**
     * map
     *
     * @param  callable  $callback
     *
     * @return  static
     *
     * @since  3.3
     */
    public function map(callable $callback): static
    {
        $items = array_map($callback, $this->items);

        return (new static($this->rendererService))->setItems($items);
    }

    /**
     * render
     *
     * @param  array  $params
     *
     * @return  string
     */
    public function render(array $params = []): string
    {
        $params['breadcrumb'] = $this;

        return $this->rendererService->render(
            '@theme::breadcrumb',
            $params,
        );
    }

    /**
     * __toString
     *
     * @return  string
     *
     * @since  1.8.19
     */
    public function __toString(): string
    {
        return $this->render();
    }

    /**
     * Method to get property Items
     *
     * @return  array
     *
     * @since  3.3
     */
    public function getItems(): array
    {
        return $this->items;
    }

    /**
     * Method to set property items
     *
     * @param  array  $items
     *
     * @return  static  Return self to support chaining.
     *
     * @since  3.3
     */
    public function setItems(array $items)
    {
        $this->items = $items;

        return $this;
    }

    /**
     * Retrieve an external iterator
     *
     * @return \Traversable
     */
    public function getIterator(): \Traversable
    {
        return new \ArrayIterator($this->items);
    }
}

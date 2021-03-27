<?php
/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Unicorn\Legacy\Html;

use Windwalker\Core\Http\AppRequest;
use Windwalker\Core\Router\Route;
use Windwalker\Utilities\Arr;
use Windwalker\Utilities\TypeCast;

/**
 * The MenuHelper class.
 *
 * @since  1.8
 */
class MenuHelper
{
    /**
     * Property activeString.
     *
     * @var  string
     */
    protected string $activeString = 'active';

    /**
     * Property pathVars.
     *
     * @var  array
     */
    protected array $pathVars = ['path', 'paths'];

    /**
     * MenuHelper constructor.
     *
     * @param  AppRequest  $request
     */
    public function __construct(protected AppRequest $request)
    {
        //
    }

    /**
     * isActive
     *
     * @param bool        $result
     * @param string|null $activeString
     *
     * @return  string
     *
     * @since  1.8.8
     */
    public function isActive(bool $result, ?string $activeString = null): string
    {
        $activeString = $activeString ?: $this->activeString;

        return $result ? $activeString : '';
    }

    /**
     * active
     *
     * @param string|array $path
     * @param array        $query
     * @param string       $menu
     *
     * @return bool
     */
    public function is(string|array $path, array $query = [], string $menu = 'mainmenu'): bool
    {
        if (is_array($path)) {
            foreach ($path as $p) {
                if ($this->is($p, $query, $menu)) {
                    return true;
                }
            }

            return false;
        }

        // Match route
        $route = $path;
        $matched = $this->getMatchedRoute();
        
        if (!$matched) {
            return false;
        }

        if ($matched->getName() === $route && $this->matchRequest($query)) {
            return true;
        }

        // If route not matched, we match extra values from routing.
        $routePaths = $matched->getExtraValue('menu')[$menu] ?? null;

        if (!$routePaths) {
            return false;
        }

        foreach ((array) $routePaths as $routePath) {
            $paths     = array_filter(explode('/', trim($path, '/')), 'strlen');
            $routePath = array_filter(explode('/', trim($routePath, '/')), 'strlen');

            foreach ($paths as $key => $pathSegment) {
                if (isset($routePath[$key]) && $routePath[$key] === $pathSegment && $this->matchRequest($query)
                    && count($paths) === ($key + 1)) {
                    return true;
                }

                continue;
            }
        }

        return false;
    }

    /**
     * inGroup
     *
     * @param string|array $groups
     * @param array        $query
     *
     * @return  bool
     *
     * @since  1.8
     */
    public function inGroup(string|array $groups, array $query = []): bool
    {
        $groups = TypeCast::toArray($groups);

        $matched = $this->getMatchedRoute();
        
        $currentGroups = array_keys($matched->getExtraValue('groups') ?? []);
        
        $active = array_intersect($groups, $currentGroups) !== [];
        
        return $active && $this->matchRequest($query);
    }

    /**
     * active
     *
     * @param string|array $path
     * @param array        $query
     * @param string       $menu
     *
     * @return  string
     *
     * @since  1.8
     */
    public function active(string|array $path, array $query = [], string $menu = 'mainmenu'): string
    {
        return $this->is($path, $query, $menu) ? $this->activeString : '';
    }

    /**
     * matchRequest
     *
     * @param array $query
     *
     * @return  boolean
     */
    protected function matchRequest(array $query = []): bool
    {
        if (!$query) {
            return true;
        }

        $requests = $this->request->inputWithMethod();

        foreach ($requests as $key => &$request) {
            if (is_array($request) && in_array($key, $this->pathVars, true)) {
                $request = implode('/', $request);
            }
        }
        
        return !empty(Arr::query([$requests], $query));
    }

    /**
     * getMatchedRoute
     *
     * @return  Route
     *
     * @since  1.8
     */
    public function getMatchedRoute(): Route
    {
        return $this->request->getMatchedRoute();
    }

    /**
     * Method to get property ActiveString
     *
     * @return  string
     *
     * @since  1.8
     */
    public function getActiveString(): string
    {
        return $this->activeString;
    }

    /**
     * Method to set property activeString
     *
     * @param   string $activeString
     *
     * @return  static  Return self to support chaining.
     *
     * @since  1.8
     */
    public function activeString(string $activeString): self
    {
        $this->activeString = $activeString;

        return $this;
    }

    /**
     * addPathVar
     *
     * @param string|array $path
     *
     * @return  static
     *
     * @since  1.8.3
     */
    public function addPathVar(string|array $path): self
    {
        $path = (array) $path;

        $this->pathVars = array_merge($this->pathVars, $path);

        return $this;
    }

    /**
     * setPathVars
     *
     * @param array $paths
     *
     * @return  static
     *
     * @since  1.8.3
     */
    public function setPathVars(array $paths = []): self
    {
        $this->pathVars = $paths;

        return $this;
    }

    /**
     * Method to get property PathVars
     *
     * @return  array
     *
     * @since  1.8.3
     */
    public function getPathVars(): array
    {
        return $this->pathVars;
    }
}

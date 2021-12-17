<?php
/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2019 LYRASOFT.
 * @license    LGPL-2.0-or-later
 */

namespace Unicorn\Legacy\Html;

use Webmozart\Glob\Glob;
use Windwalker\Core\Http\AppRequest;
use Windwalker\Core\Router\Route;
use Windwalker\Data\Collection;
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
     * @param  string|array  $path
     * @param  array|false   $query
     * @param  string        $menu
     *
     * @return bool
     */
    public function is(string|array $path, array|false $query = false, string $menu = 'mainmenu'): bool
    {
        if (is_array($path)) {
            foreach ($path as $p) {
                if ($this->is($p, $query, $menu)) {
                    return true;
                }
            }

            return false;
        }

        $matched = $this->getMatchedRoute();
        
        if (!$matched) {
            return false;
        }

        $routeName = $matched->getName();
        $shortName = Collection::explode('::', $matched->getName())->last();

        // Step (1): Match route with wildcards
        if (str_contains($path, '*')) {
            $path2 = ltrim($path, '/');

            $hasMatch = fnmatch($path2, $routeName)
                || fnmatch($path2, $shortName)
                || fnmatch($path2, $this->request->getSystemUri()->route());

            if ($hasMatch) {
                return true;
            }
        }

        // Step (2): Match ns::route
        if ($path === $routeName && str_contains($path, '::') && $this->matchRequest($query)) {
            return true;
        }

        // Step (3): Match route without ns
        if ($path === $shortName && $this->matchRequest($query)) {
            return true;
        }

        $menuDirect = $matched->getExtraValue('menu')[$menu] ?? null;

        // Step (4): If route not matched, we match extra values from routing.
        if ($menuDirect) {
            if ($menuDirect === $path && $this->matchRequest($query)) {
                return true;
            }

            if (str_contains($path, '::')) {
                $path2 = explode('::', $path, 2);

                if (array_pop($path2) === $menuDirect && $this->matchRequest($query)) {
                    return true;
                }
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
     * @param  array|false  $query
     *
     * @return  boolean
     */
    protected function matchRequest(array|false $query = []): bool
    {
        if ($query === false) {
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
     * @return Route|null
     *
     * @since  1.8
     */
    public function getMatchedRoute(): ?Route
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

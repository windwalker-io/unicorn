<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Windwalker\Core\State\AppState;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Utilities\Str;
use Windwalker\Utilities\StrNormalize;

/**
 * Trait StateControlRepositoryTrait
 */
trait StateControlRepositoryTrait
{
    #[Inject]
    protected AppState $state;

    protected string $moduleNamespaceBase = 'App\\Module';

    public function getState(): AppState
    {
        return $this->state->withPrefix($this->guessName());
    }

    /**
     * @return string
     */
    public function getModuleNamespaceBase(): string
    {
        return $this->moduleNamespaceBase;
    }

    /**
     * @param  string  $moduleNamespaceBase
     *
     * @return  static  Return self to support chaining.
     */
    public function setModuleNamespaceBase(string $moduleNamespaceBase): static
    {
        $this->moduleNamespaceBase = $moduleNamespaceBase;

        return $this;
    }

    private function guessName(): string
    {
        $ref = new \ReflectionClass($this);
        $name = $ref->getShortName();

        if (str_ends_with($name, 'Repository')) {
            return Str::removeRight($ref->getShortName(), 'Repository');
        }

        $ns = $ref->getNamespaceName();
        $ns = \Windwalker\str($ns)
            ->removeLeft($this->moduleNamespaceBase)
            ->trim('\\')
            ->replace('\\', '.')
            ->toLowerCase();

        return (string) $ns;
    }
}

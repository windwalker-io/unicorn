<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Asset\AbstractScript;

/**
 * The UnicornScript class.
 */
class UnicornScript extends AbstractScript
{
    protected array $data = [];

    public array $initialise = [];

    public function switcher(): void
    {
        if (!$this->available()) {
            $this->css('@unicorn/switcher.css');
        }
    }

    public function importScript(string $uri): static
    {
        $this->internalJS("u.import('$uri');");

        return $this;
    }

    public function data(string $name, mixed $data, bool $merge = true): static
    {
        if ($merge) {
            $this->data = static::mergeOptions($this->data, [$name => $data]);
        } else {
            $this->data[$name] = $data;
        }

        return $this;
    }

    public function addInitialise(string $code, ?string $name = null): static
    {
        static $uid = 0;

        if ($name === null) {
            $name = (string) $uid++;
        }

        $this->initialise[$name] = $code;

        return $this;
    }

    /**
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }
}

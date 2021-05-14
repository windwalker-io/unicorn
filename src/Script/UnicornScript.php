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
use Windwalker\Core\Http\Browser;

/**
 * The UnicornScript class.
 */
class UnicornScript extends AbstractScript
{
    protected array $data = [];

    public array $initialise = [];

    /**
     * UnicornScript constructor.
     */
    public function __construct(protected Browser $browser)
    {
    }

    public function systemJS(): void
    {
        if ($this->available()) {
            $version = $this->asset->getVersion();

            $attrs = [];

            if ($this->browser->isIE()) {
                $attrs['onload'] = "hookSystemJS('$version')";
            } else {
                $attrs['data-version'] = $version;
            }

            $this->js('@systemjs', [], ['onload' => 'window.S = System']);
            $this->js('@unicorn/system-hooks.js', [], $attrs);
        }
    }

    public function main(): void
    {
        $this->importScript('@main');
    }

    public function importScript(string $uri): static
    {
        $this->internalJS("System.import('$uri');");

        return $this;
    }

    public function importThen(string $uri, string $code): static
    {
        $this->internalJS(<<<JS
System.import('$uri').then(function (module) {
  $code
});
JS
);

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

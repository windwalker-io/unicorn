<?php

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AbstractScript;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Security\CspNonceService;
use Windwalker\Core\Security\CsrfService;
use Windwalker\DI\Exception\DefinitionException;
use Windwalker\DOM\HTMLElement;
use Windwalker\Utilities\Str;

/**
 * The UnicornScript class.
 */
class UnicornScript extends AbstractScript
{
    // public bool $next {
    //     get => $this->app->config('unicorn.modules.next') ?? false;
    // }

    protected array $data = [];

    public array $initialise = [];

    public bool $importMain = false;

    /**
     * UnicornScript constructor.
     */
    public function __construct(
        protected AppContext $app,
        protected LangService $langService,
        protected Navigator $nav
    ) {
    }

    public function systemJS(): static
    {
        if ($this->available()) {
            $version = $this->asset->getVersion();

            $this->js('@systemjs');
            $this->asset->addLink(
                'scripts',
                '@system-onload',
                [
                    'body' => 'window.S = System',
                ]
            );
            $this->js('@unicorn/system-hooks.js', [], ['data-version' => $version]);
        }

        return $this;
    }

    /**
     * @param  string|null  $mainJS
     *
     * @return  static
     *
     * @throws DefinitionException
     */
    public function init(?string $mainJS = null): static
    {
        if ($this->next) {
            if ($mainJS) {
                $this->asset->importMap(
                    '@main',
                    $this->asset->appendVersion(
                        $this->asset->handleUri($mainJS)
                    )
                );

                $cssEntries = $this->asset->vite->resolveUriCssEntries($mainJS);

                foreach ($cssEntries as $css) {
                    $this->asset->css($css);
                }
            }

            $this->asset->importMap(
                '@windwalker-io/unicorn',
                $this->asset->appendVersion(
                    $this->asset->handleUri('vendor/@windwalker-io/unicorn-next/dist/unicorn.js')
                )
            );

            $this->asset->importMap(
                '@windwalker-io/unicorn/',
                $this->asset->handleUri('vendor/@windwalker-io/unicorn-next/dist/')
            );

            $this->asset->importMap(
                '@unicorn/',
                $this->asset->handleUri('vendor/@windwalker-io/unicorn-next/dist/')
            );

            $this->main();

            return $this;
        }

        if ($mainJS) {
            $this->asset->importMap('@main', $mainJS);
        }

        $this->systemJS();
        $this->main();

        return $this;
    }

    /**
     * @return  static
     *
     * @throws DefinitionException
     */
    public function main(): static
    {
        $this->translate('unicorn.message.delete.confirm');
        $this->translate('unicorn.message.grid.checked');
        $this->translate('unicorn.message.validation.*');

        $uri = $this->app->getSystemUri()->all();
        $uri['asset'] = [
            'path' => $this->asset->path(),
            'root' => $this->asset->root(),
        ];

        $this->data('unicorn.uri', $uri);

        $this->exposeCsrfToken();

        $this->importMain = true;

        return $this;
    }

    public function importScript(string $uri, bool $afterMain = false): static
    {
        if ($this->next) {
            $this->asset->importModule($uri);

            return $this;
        }

        if ($afterMain) {
            $this->importMainThen("u.import('$uri');");
        } else {
            $this->internalJS("System.import('$uri');");
        }

        return $this;
    }

    public function importThen(string $uri, string $code, bool $afterMain = false): static
    {
        if ($this->next) {
            $this->asset->importModule($uri, $code);

            return $this;
        }

        $importer = $afterMain ? 'u' : 'System';

        $js = <<<JS
        $importer.import('$uri').then(function (module) {
          $code
        });
        JS;

        if ($afterMain) {
            $this->importMainThen($js);
        } else {
            $this->internalJS($js);
        }

        return $this;
    }

    public function importMainThen(string $code): static
    {
        $this->addInitialise($code);

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

    public function translate(array|string $key): static
    {
        if (is_array($key)) {
            foreach ($key as $keyName) {
                $this->translate($keyName);
            }

            return $this;
        }

        $normalize = $this->langService->getNormalizeHandler();
        $trans = [];

        if (str_ends_with($key, '*')) {
            $key = substr($key, 0, -1);
            $key = $normalize($key);

            $locale = $this->langService->getLocale();
            $fallback = $this->langService->getFallback();

            $strings = $this->langService->getStrings();

            foreach ($strings[$fallback] ?? [] as $k => $string) {
                $k = $normalize($k);

                if (str_starts_with($k, $key)) {
                    $trans[$k] = $this->langService->trans($k);
                }
            }

            if ($locale !== $fallback) {
                foreach ($strings[$locale] ?? [] as $k => $string) {
                    $k = $normalize($k);

                    if (str_starts_with($k, $key)) {
                        $trans[$k] = $this->langService->trans($k);
                    }
                }
            }
        } else {
            $key = $normalize($key);

            $trans[$key] = $this->langService->trans($key);
        }

        $this->data('unicorn.languages', $trans, true);

        return $this;
    }

    public function addRoute(string $route, mixed $url = null): static
    {
        if ($url === null || is_array($url)) {
            $url = $this->nav->to(Str::removeLeft($route, '@', 'ascii'), $url ?? []);
        }

        $route = Str::ensureLeft($route, '@');

        $this->data('unicorn.routes', [$route => (string) $url], true);

        return $this;
    }

    public function mark(?string $selector = null, string $keyword = '', array $options = []): static
    {
        if ($selector && $this->available($selector)) {
            $opt = static::getJSObject($options);
            $this->importMainThen("u.\$ui.mark('$selector', '$keyword', $opt)");
        } elseif ($this->available()) {
            $this->importMainThen("u.\$ui.mark()");
        }

        return $this;
    }

    public function disableTransitionBeforeLoad(
        string $className = 'h-no-transition',
        HTMLElement|HtmlFrame|null $body = null
    ): void {
        if ($this->available($className)) {
            $css = <<<CSS
.$className * {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -ms-transition: none !important;
  -o-transition: none !important;
  transition: none !important;
}
CSS;

            $this->internalCSS($css);
            $this->importMainThen("u.domready(() => document.body.classList.remove('$className'))");

            $body ??= $this->app->service(HtmlFrame::class);

            if ($body instanceof HtmlFrame) {
                $body = $body->getBodyElement();
            }

            $body->addClass($className);
        }
    }

    /**
     * @param  string  $keyName
     *
     * @return  void
     *
     * @throws DefinitionException
     */
    public function exposeCsrfToken(string $keyName = 'csrf-token'): void
    {
        $this->data($keyName, $this->app->service(CsrfService::class)->getToken());
    }

    /**
     * @param  string  $keyName
     *
     * @return  void
     *
     * @throws DefinitionException
     */
    public function exposeCspNonce(string $keyName = 'csp-nonce'): void
    {
        $cspService = $this->app->service(CspNonceService::class);

        $this->data($keyName, $cspService->getNonce());
    }
}

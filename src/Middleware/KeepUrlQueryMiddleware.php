<?php

namespace Unicorn\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Http\AppRequest;
use Windwalker\Core\Router\Event\BeforeRouteBuildEvent;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\View\Event\BeforeRenderEvent;
use Windwalker\DI\Definition\DefinitionFactory;
use Windwalker\DI\Definition\DefinitionInterface;
use Windwalker\DI\DICreateTrait;
use Windwalker\Utilities\Options\OptionsResolverTrait;

use function Windwalker\nope;

/**
 * The KeepUrlQueryMiddleware class.
 *
 * @since  1.8.38
 */
class KeepUrlQueryMiddleware implements MiddlewareInterface
{
    use OptionsResolverTrait;
    use DICreateTrait;

    public function __construct(
        protected AppContext $app,
        protected AppRequest $request,
        protected Navigator $navigator,
        protected string $key = '',
        protected string $uid = '',
        protected mixed $default = '',
        protected \Closure|bool|null $routeEnabled = true,
        protected \Closure|null $afterHook = null,
        protected \Closure|null $viewHook = null,
        /**
         * @deprecated  Use constructor arguments instead.
         */
        array $options = [],
    ) {
        $this->resolveOptions($options, [$this, 'configureOptions']);
    }

    protected function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->define('route_enabled')
            ->default($this->routeEnabled)
            ->allowedTypes('bool', 'null', 'callable');

        $resolver->define('after_hook')
            ->allowedTypes('null', 'callable')
            ->default($this->afterHook);

        $resolver->define('view_hook')
            ->allowedTypes('null', 'callable')
            ->default($this->viewHook);

        $resolver->define('key')
            ->allowedTypes('string')
            ->default($this->key)
            ->required();

        // If provides a uid, then we'll use uid to match same middlewares.
        $resolver->define('uid')
            ->allowedTypes('string')
            ->default($this->uid)
            ->default('');

        $resolver->define('default')
            ->default($this->default);
    }

    /**
     * Process an incoming server request.
     *
     * Processes an incoming server request in order to produce a response.
     * If unable to produce the response itself, it may delegate to the provided
     * request handler to do so.
     *
     * @param  ServerRequestInterface   $request
     * @param  RequestHandlerInterface  $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $key     = $this->options['key'];
        $def     = $this->options['default'];
        $routeEnabled = $this->options['route_enabled'];
        $afterHook    = $this->options['after_hook'];
        $viewHook     = $this->options['view_hook'];

        $value = $this->request->input($key) ?: $def;

        $this->navigator->on(
            BeforeRouteBuildEvent::class,
            function (BeforeRouteBuildEvent $event) use (
                $request,
                $routeEnabled,
                $key,
                $value
            ) {
                $route = $event->route;

                if (is_callable($routeEnabled) && !$routeEnabled($event, $this->options, $request)) {
                    return;
                }

                if (!$routeEnabled) {
                    return;
                }

                $route = $this->navigator->findRoute($route);

                if (!$route) {
                    return;
                }

                foreach ((array) $route->getExtraValue('middlewares') as $item) {
                    if ($this->isSame($item) && $value) {
                        $event->options->addAllowQuery($key);

                        $event->query[$key] ??= $value;
                    }
                }
            }
        );

        if ($afterHook && is_callable($afterHook)) {
            $afterHook($value, $this->options, $request);
        }

        if ($viewHook && is_callable($viewHook)) {
            $this->app->on(
                BeforeRenderEvent::class,
                function (BeforeRenderEvent $event) use ($request, $value, $viewHook) {
                    $viewHook($event, $value, $this->options, $request);
                }
            );
        }

        return $handler->handle($request);
    }

    /**
     * isSame
     *
     * @param string|DefinitionInterface|object $middleware
     *
     * @return  bool
     *
     * @throws \ReflectionException
     *
     * @since  1.8.39
     */
    protected function isSame(mixed $middleware): bool
    {
        if (!DefinitionFactory::isSameClass(static::class, $middleware)) {
            return false;
        }

        if (!$middleware instanceof MiddlewareInterface) {
            $middleware = $this->app->getContainer()->resolve($middleware);
        }

        if (!$middleware instanceof static) {
            return false;
        }

        $myUid = (string) $this->getOption('uid');
        $theirUid = (string) $middleware->getOption('uid');
        $myKey = (string) $this->getOption('key');
        $theirKey = (string) $middleware->getOption('key');

        return $myUid === $theirUid && $myKey === $theirKey;
    }
}

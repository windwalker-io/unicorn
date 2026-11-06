<?php

/**
 * PHPUnit bootstrap for running Core tests inside a host application.
 *
 * Referenced by phpunit.app.dist.xml. It loads the host's autoloader and
 * etc/define.php, boots Runtime, and prepares TestApp::$instance and
 * TestApp::$sharedCtx (also assigned to TestApp::$ctx), which the traits in
 * src/Core/Testing/Traits rely on by default.
 *
 * The host root is taken from the WINDWALKER_TEST_APP_ROOT environment
 * variable, otherwise from the conventional vendor/windwalker/core location.
 */

declare(strict_types=1);

use Composer\Autoload\ClassLoader;
use Unicorn\Tests\TestApp;
use Unicorn\UnicornPackage;
use Windwalker\Core\Edge\Component\XComponent;
use Windwalker\Core\Theme\BootstrapTheme;
use Windwalker\Core\Theme\ThemeInterface;
use Windwalker\DI\Container;
use Windwalker\Edge\Provider\EdgeProvider;
use Windwalker\Renderer\EdgeRenderer;
use Windwalker\Renderer\MustacheRenderer;
use Windwalker\Renderer\PlatesRenderer;
use Windwalker\Renderer\Provider\RendererProvider;
use Windwalker\Renderer\TwigRenderer;

$init = include __DIR__ . '/../../core/src/Core/Testing/test.init.php';

/** @var Container $container */
/** @var ClassLoader $classLoader */
[$container, $classLoader] = $init(
    root: $root = env('WINDWALKER_TEST_APP_ROOT') ?: dirname(__DIR__),
    workDir: $root
);

// Load local tests
$classLoader->addPsr4('Unicorn\Tests\\', __DIR__ . '/');

TestApp::createInstance(
    container: $container,
    config: [
        '@root' => $root,
        '@temp' => $root . '/tmp',
        '@cache' => $root . '/cache',
        '@public' => $root . '/tests/public',
        '@migrations' => $root . '/tests/resources/migrations',
        '@seeders' => $root . '/tests/resources/seeders',
    ],
);

/*
 * Minimal `renderer` / `unicorn` config, inlined so the test process depends
 * on neither the host's `etc/config.php` nor `etc/runtime.config.php` (and
 * therefore on no `WINDWALKER_*` constants). Only what rendering needs is
 * registered; auth, mail, routing, etc. are deliberately left out.
 */
$container->loadParameters([
    'app' => [
        'debug' => false,
    ],
    'renderer' => [
        'paths' => [
            '@root/views',
            __DIR__ . '/views',
            dirname(__DIR__) . '/views',
            dirname(__DIR__) . '/views/ui/bootstrap5',
        ],
        'renderers' => [
            'edge' => [EdgeRenderer::class, ['edge.php', 'blade.php']],
            'plates' => [PlatesRenderer::class, ['php']],
            'mustache' => [MustacheRenderer::class, ['mustache']],
            'twig' => [TwigRenderer::class, ['twig']],
        ],
        'options' => [
            'cache_path' => $root . '/cache/renderer',
        ],
        'pagination' => [
            'template' => '@pagination',
            'neighbours' => 4,
        ],
        'aliases' => [
            '@pagination' => 'layout.pagination.basic-pagination',

            '@messages' => 'layout.messages.bs5-messages',
            '@csrf' => 'layout.security.csrf',
        ],
        'edge' => [
            'components' => [
                'component' => XComponent::class,
                'template' => XComponent::class,
            ],
        ],
    ],
    'unicorn' => [
        'modules' => ['next' => true],
    ],
]);

$container->registerByConfig(
    [
        'providers' => [
            RendererProvider::class,
            EdgeProvider::class,
        ],
        'bindings' => [
            ThemeInterface::class => BootstrapTheme::class,
        ],
    ],
);

$container->registerByConfig(
    [
        'providers' => [
            UnicornPackage::class,
        ],
    ],
);

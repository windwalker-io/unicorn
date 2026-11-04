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

$init = include __DIR__ . '/../../core/src/Core/Testing/test.init.php';

$container = $init(
    root: $root = env('WINDWALKER_TEST_APP_ROOT') ?: dirname(__DIR__),
    workDir: $root,
);

$container->options->lazy = true;

\Unicorn\Tests\TestApp::createInstance(
    container: $container,
    config: [
        '@root' => $root,
        '@temp' => $root . '/tmp',
        '@public' => $root . '/tests/public',
        '@migrations' => $root . '/tests/resources/migrations',
        '@seeders' => $root . '/tests/resources/seeders',
    ]
);

/*
 * `www/index.php` defines a handful of constants via `etc/define.php` and
 * registers every `@alias` path via `etc/runtime.config.php` before
 * anything else boots, then `etc/app/main.config.php` merges in the host
 * app's own `etc/config.php` (package providers, `renderer.aliases`, view
 * paths, etc.). This test bootstrap intentionally stays minimal and skips
 * all of that - most app-backed tests don't need it - but anything that
 * renders a real view (Edge components, layouts) does, so load just the
 * `renderer`/`unicorn` config modules here, once, for every app-backed
 * test to share. We deliberately do NOT load the rest of `etc/config.php`
 * (auth, mail, routing, etc.): registering those providers here would
 * change behavior for every existing app-backed test, not just rendering
 * ones.
 */
foreach (
    [
        'WINDWALKER_BIN' => $root . '/bin',
        'WINDWALKER_ETC' => $root . '/etc',
        'WINDWALKER_LOGS' => $root . '/logs',
        'WINDWALKER_ROUTES' => $root . '/routes',
        'WINDWALKER_RESOURCES' => $root . '/resources',
        'WINDWALKER_SOURCE' => $root . '/src',
        'WINDWALKER_VIEWS' => $root . '/views',
        'WINDWALKER_VENDOR' => $root . '/vendor',
        'WINDWALKER_PUBLIC' => $root . '/www',
        'WINDWALKER_SERVERS' => $root . '/servers',
        'WINDWALKER_MIGRATIONS' => $root . '/resources/migrations',
        'WINDWALKER_SEEDERS' => $root . '/resources/seeders',
        'WINDWALKER_LANGUAGES' => $root . '/resources/languages',
        'WINDWALKER_DEBUG' => false,
        'WINDWALKER_CACHE' => $root . '/cache',
        'WINDWALKER_TEMP' => $root . '/tmp',
    ] as $name => $value
) {
    if (!defined($name)) {
        define($name, $value);
    }
}

$container->loadParameters(
    array_filter(
        require $root . '/etc/runtime.config.php',
        static fn(string $key) => str_starts_with($key, '@'),
        ARRAY_FILTER_USE_KEY,
    )
);

$rendererConfig = require $root . '/etc/config.php';

$container->loadParameters($rendererConfig);

foreach (['renderer', 'unicorn'] as $module) {
    if ($rendererConfig[$module]['enabled'] ?? true) {
        $container->registerByConfig($rendererConfig[$module] ?? []);
    }
}

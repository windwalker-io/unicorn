<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn;

use Windwalker\Core\Package\AbstractPackage;
use Windwalker\Core\Package\PackageInstaller;
use Windwalker\Core\Security\CsrfService;
use Windwalker\DI\BootableDeferredProviderInterface;
use Windwalker\DI\BootableProviderInterface;
use Windwalker\DI\Container;
use Windwalker\DI\ServiceProviderInterface;
use Windwalker\Renderer\CompositeRenderer;
use Windwalker\Session\Cookie\Cookies;
use Windwalker\Utilities\Arr;

/**
 * The UnicornPackage class.
 */
class UnicornPackage extends AbstractPackage implements
    ServiceProviderInterface,
    BootableProviderInterface,
    BootableDeferredProviderInterface
{
    /**
     * boot
     *
     * @param  Container  $container
     *
     * @return  void
     */
    public function boot(Container $container): void
    {
    }

    /**
     * boot
     *
     * @param  Container  $container
     *
     * @return  void
     */
    public function bootDeferred(Container $container): void
    {
        // if ($container->getParam('unicorn.csrf.auto_set_cookie')) {
        //     $name = $container->getParam('unicorn.csrf.cookie_name') ?? 'XSRF-TOKEN';
        //     $csrf = $container->get(CsrfService::class);
        //
        //     if ($container->has(Cookies::class)) {
        //         $container->get(Cookies::class)->set($name, $csrf->getToken());
        //     } else {
        //         setcookie($name, $csrf);
        //     }
        // }
    }

    /**
     * Registers the service provider with a DI container.
     *
     * @param  Container  $container  The DI container.
     *
     * @return  void
     */
    public function register(Container $container): void
    {
        $container->extend(
            CompositeRenderer::class,
            function (CompositeRenderer $renderer) {
                $renderer->addPath(dirname(__DIR__) . '/views');

                return $renderer;
            }
        );

        $container->mergeParameters(
            'asset.import_map.imports',
            [
                '@systemjs' => 'vendor/systemjs/dist/system.js',
                '@unicorn/' => 'vendor/@windwalker-io/unicorn/dist/',
                '@alpinejs' => 'vendor/alpinejs/dist/alpine.js',
                '@axios' => 'vendor/axios/dist/axios.js',
                '@awesome-checkbox' => 'vendor/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css'
            ]
        );

        $container->mergeParameters(
            'renderer.aliases',
            [
                '@theme' => 'ui.bootstrap5',
                '@filter-bar' => '@theme.grid.filter-bar',
                '@sort' => '@theme.grid.sort',
            ]
        );
    }

    public function install(PackageInstaller $installer): void
    {
        $installer->installConfig(__DIR__ . '/../etc/*.php', 'config');
    }
}

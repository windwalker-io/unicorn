<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn;

use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Mime\MimeTypesInterface;
use Unicorn\Attributes\StateMachine;
use Unicorn\Script\UnicornScript;
use Unicorn\Upload\FileUploadManager;
use Windwalker\Core\Package\AbstractPackage;
use Windwalker\Core\Package\PackageInstaller;
use Windwalker\DI\Attributes\AttributeType;
use Windwalker\DI\BootableDeferredProviderInterface;
use Windwalker\DI\BootableProviderInterface;
use Windwalker\DI\Container;
use Windwalker\DI\ServiceProviderInterface;
use Windwalker\Renderer\CompositeRenderer;

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
        $container->prepareSharedObject(UnicornScript::class);
        $container->prepareSharedObject(FileUploadManager::class);
        $container->prepareSharedObject(MimeTypes::class)
            ->alias(MimeTypesInterface::class, MimeTypes::class);

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
                '@unicorn' => 'vendor/@windwalker-io/unicorn/dist/unicorn.js',
                '@main' => 'vendor/@windwalker-io/unicorn/dist/unicorn.js',
                '@alpinejs' => 'vendor/alpinejs/dist/alpine.js',
                '@alpinejs-ie11' => 'vendor/alpinejs/dist/alpine-ie11.js',
                '@spruce' => 'vendor/@ryangjchandler/spruce/dist/spruce.umd.js',
                '@axios' => 'vendor/axios/dist/axios.js',
                '@awesome-checkbox' => 'vendor/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css',
                '@regenerator-runtime' => 'vendor/regenerator-runtime/runtime.js',
                '@flatpickr/' => 'vendor/flatpickr/dist/',
                '@cropperjs/' => 'vendor/cropperjs/dist/',
                '@tinymce' => 'vendor/tinymce/tinymce.js',
            ]
        );

        $container->mergeParameters(
            'renderer.aliases',
            [
                '@theme' => 'ui.bootstrap5',
                '@title-bar' => '@theme.form.title-bar',
                '@filter-bar' => '@theme.grid.filter-bar',
                '@sort' => '@theme.grid.sort',
                '@toggle-all' => '@theme.grid.toggle-all',
                '@row-checkbox' => '@theme.grid.row-checkbox',
                '@order-control' => '@theme.grid.order-control',
                '@save-order' => '@theme.grid.save-order',
                '@batch-modal' => '@theme.grid.batch-modal',
                '@card' => '@theme.card',
                '@fieldset' => '@theme.form.fieldset',
            ]
        );

        $container->mergeParameters(
            'renderer.edge.components',
            [
                'title-bar' => '@title-bar',
                'filter-bar' => '@filter-bar',
                'sort' => '@sort',
                'toggle-all' => '@toggle-all',
                'row-checkbox' => '@row-checkbox',
                'order-control' => '@order-control',
                'save-order' => '@save-order',
                'batch-modal' => '@batch-modal',
                'card' => '@card',
                'field' => '@theme.form.field-wrapper',
                'input' => '@theme.form.input',
                'label' => '@theme.form.label',
                'fieldset' => '@fieldset',
            ]
        );

        $container->getAttributesResolver()
            ->registerAttribute(StateMachine::class, AttributeType::CLASSES);
    }

    public function install(PackageInstaller $installer): void
    {
        $installer->installConfig(__DIR__ . '/../etc/*.php', 'config');
        $installer->installRoutes(__DIR__ . '/../routes/*.php', 'routes');
    }
}

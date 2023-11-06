<?php

declare(strict_types=1);

namespace Unicorn;

use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Mime\MimeTypesInterface;
use Unicorn\Attributes\StateMachine;
use Unicorn\Command\MigFromCommand;
use Unicorn\Controller\CrudController;
use Unicorn\Controller\GridController;
use Unicorn\Generator\Command\BuildFormCommand;
use Unicorn\Generator\SubCommand\ControllerSubCommand;
use Unicorn\Generator\SubCommand\ModelSubCommand;
use Unicorn\Generator\SubCommand\MvcAdminSubCommand;
use Unicorn\Generator\SubCommand\RouteSubCommand;
use Unicorn\Generator\SubCommand\ViewEditSubCommand;
use Unicorn\Generator\SubCommand\ViewGridSubCommand;
use Unicorn\Generator\SubCommand\WorkflowSubCommand;
use Unicorn\Image\ImagePlaceholder;
use Unicorn\Listener\EmptyArrayFieldSubscriber;
use Unicorn\Script\AwsScript;
use Unicorn\Script\BootstrapScript;
use Unicorn\Script\EditorScript;
use Unicorn\Script\FormScript;
use Unicorn\Script\JQueryScript;
use Unicorn\Script\ModernScript;
use Unicorn\Script\UnicornScript;
use Unicorn\Script\VueScript;
use Unicorn\Upload\FileUploadManager;
use Windwalker\Core\Application\AppClient;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Application\Context\AppContextInterface;
use Windwalker\Core\DI\RequestBootableProviderInterface;
use Windwalker\Core\Package\AbstractPackage;
use Windwalker\Core\Package\PackageInstaller;
use Windwalker\Core\Renderer\RendererService;
use Windwalker\DI\Attributes\AttributeType;
use Windwalker\DI\BootableDeferredProviderInterface;
use Windwalker\DI\BootableProviderInterface;
use Windwalker\DI\Container;
use Windwalker\DI\ServiceProviderInterface;

/**
 * The UnicornPackage class.
 */
class UnicornPackage extends AbstractPackage implements
    ServiceProviderInterface,
    BootableProviderInterface,
    BootableDeferredProviderInterface,
    RequestBootableProviderInterface
{
    /**
     * UnicornPackage constructor.
     */
    public function __construct(protected ApplicationInterface $app)
    {
    }

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
        //
    }

    public function bootBeforeRequest(Container $container): void
    {
        if (
            $this->app->getClient() === AppClient::WEB
            && $container->has(AppContext::class)
        ) {
            $app = $container->get(AppContext::class);
            $app->subscribe($container->newInstance(EmptyArrayFieldSubscriber::class));
        }
    }

    /**
     * Registers the service provider with a DI container.
     *
     * @param  Container  $container  The DI container.
     *
     * @return  void
     * @throws \Windwalker\DI\Exception\DefinitionException
     */
    public function register(Container $container): void
    {
        $container->prepareSharedObject(UnicornScript::class);
        $container->prepareSharedObject(BootstrapScript::class);
        $container->prepareSharedObject(FormScript::class);
        $container->prepareSharedObject(JQueryScript::class);
        $container->prepareSharedObject(EditorScript::class);
        $container->prepareSharedObject(VueScript::class);
        $container->prepareSharedObject(ModernScript::class);
        $container->prepareSharedObject(AwsScript::class);
        $container->prepareSharedObject(FileUploadManager::class);
        $container->prepareSharedObject(MimeTypes::class)
            ->alias(MimeTypesInterface::class, MimeTypes::class);

        // Services
        $container->prepareSharedObject(ImagePlaceholder::class);

        // MVC
        $container->prepareSharedObject(CrudController::class);
        $container->prepareSharedObject(GridController::class);

        if ($container->has(RendererService::class)) {
            $container->extend(
                RendererService::class,
                function (RendererService $renderer) {
                    $renderer->addPath(dirname(__DIR__) . '/views');
                    $renderer->addPath(dirname(__DIR__) . '/views/ui/bootstrap5', null, '@theme');

                    return $renderer;
                }
            );
        }

        $container->mergeParameters(
            'asset.import_map.imports',
            [
                '@systemjs'     => 'vendor/systemjs/dist/system.js',
                '@unicorn/'     => 'vendor/@windwalker-io/unicorn/dist/',
                '@unicorn'      => 'vendor/@windwalker-io/unicorn/dist/unicorn.js',
                '@main'         => 'vendor/@windwalker-io/unicorn/dist/unicorn.js',
                '@jquery'       => 'vendor/jquery/dist/jquery.min.js',
                '@alpinejs'     => 'vendor/alpinejs/dist/cdn.js',
                '@spruce'       => 'vendor/@ryangjchandler/spruce/dist/spruce.umd.js',
                '@axios'        => 'vendor/axios/dist/axios.js',
                '@awesome-checkbox' => 'vendor/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css',
                '@regenerator-runtime' => 'vendor/regenerator-runtime/runtime.js',
                '@flatpickr/'   => 'vendor/flatpickr/dist/',
                '@cropperjs/'   => 'vendor/cropperjs/dist/',
                '@tinymce'      => 'vendor/tinymce/tinymce.js',
                '@sortablejs'   => 'vendor/sortablejs/Sortable.min.js',
                '@spectrum/'   => 'vendor/spectrum-vanilla/dist/',
                '@spectrum'   => 'vendor/spectrum-vanilla/dist/spectrum.min.js',
                '@vue'          => 'vendor/vue/dist/vue.global' . ($this->app->isDebug() ? '' : '.prod') . '.js',
                '@vuedraggable' => 'vendor/vuedraggable/dist/vuedraggable.umd.min.js',
                '@vue2-animate' => 'vendor/vue2-animate/dist/vue2-animate.min.css',
                '@core-js'      => 'vendor/core-js-bundle/minified.js',
                '@current-script-polyfill' => 'vendor/current-script-polyfill/currentScript.js',
            ]
        );

        $container->mergeParameters(
            'renderer.aliases',
            [
                // '@theme' => 'ui.bootstrap5',
                '@title-bar' => '@theme::form.title-bar',
                '@filter-bar' => '@theme::grid.filter-bar',
                '@sort' => '@theme::grid.sort',
                '@toggle-all' => '@theme::grid.toggle-all',
                '@row-checkbox' => '@theme::grid.row-checkbox',
                '@order-control' => '@theme::grid.order-control',
                '@save-order' => '@theme::grid.save-order',
                '@state-button' => '@theme::grid.state-button',
                '@state-dropdown' => '@theme::grid.state-dropdown',
                '@batch-modal' => '@theme::grid.batch-modal',
                '@fieldset' => '@theme::form.fieldset',
                '@bool-icon' => '@theme::bool-icon',
                '@card' => '@theme::components.card',
                '@input-group' => '@theme::components.input-group',
                '@breadcrumb' => '@theme::components.breadcrumb',
                '@tabs' => '@theme::components.tabs',
                '@tab' => '@theme::components.tab',
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
                'state-button' => '@state-button',
                'state-dropdown' => '@state-dropdown',
                'batch-modal' => '@batch-modal',
                'field' => '@theme::form.field-wrapper',
                'input' => '@theme::form.input',
                'label' => '@theme::form.label',
                'fieldset' => '@fieldset',
                'bool-icon' => '@bool-icon',
                'card' => '@card',
                'div' => '@theme::components.div',
                'input-group' => '@input-group',
                'breadcrumb' => '@breadcrumb',
                'tabs' => '@tabs',
                'tab' => '@tab',
            ]
        );

        $container->getAttributesResolver()
            ->registerAttribute(StateMachine::class, AttributeType::CLASSES);

        if ($this->app->getClient() === AppClient::CONSOLE) {
            $container->mergeParameters(
                'commands',
                [
                    'build:form' => BuildFormCommand::class,
                    'mig:from' => MigFromCommand::class,
                ]
            );

            $container->mergeParameters(
                'generator.commands',
                [
                    'unicorn:controller' => ControllerSubCommand::class,
                    'unicorn:model' => ModelSubCommand::class,
                    'unicorn:view-grid' => ViewGridSubCommand::class,
                    'unicorn:view-edit' => ViewEditSubCommand::class,
                    'unicorn:route' => RouteSubCommand::class,
                    'unicorn:mvc-admin' => MvcAdminSubCommand::class,
                    'unicorn:workflow' => WorkflowSubCommand::class,
                    // 'unicorn:workflow' => ModelSubCommand::class,
                ]
            );
        }
    }

    public function install(PackageInstaller $installer): void
    {
        $installer->installConfig(__DIR__ . '/../etc/*.php', 'config');
        $installer->installRoutes(__DIR__ . '/../routes/**/*.php', 'routes');
        $installer->installLanguages(__DIR__ . '/../resources/languages/**/*', 'lang');
    }
}

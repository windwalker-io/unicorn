<?php

declare(strict_types=1);

namespace Unicorn;

use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Mime\MimeTypesInterface;
use Unicorn\Attributes\StateMachine;
use Unicorn\Command\MigFromCommand;
use Unicorn\Component\PublishingDropdownComponent;
use Unicorn\Component\StateButtonComponent;
use Unicorn\Component\StateDropdownComponent;
use Unicorn\Controller\CrudController;
use Unicorn\Controller\GridController;
use Unicorn\Generator\Command\BuildFormCommand;
use Unicorn\Generator\SubCommand\ControllerSubCommand;
use Unicorn\Generator\SubCommand\ModelSubCommand;
use Unicorn\Generator\SubCommand\MvcAdminSubCommand;
use Unicorn\Generator\SubCommand\MvcSimpleSubCommand;
use Unicorn\Generator\SubCommand\RouteSubCommand;
use Unicorn\Generator\SubCommand\ViewEditSubCommand;
use Unicorn\Generator\SubCommand\ViewGridSubCommand;
use Unicorn\Generator\SubCommand\ViewItemSubCommand;
use Unicorn\Generator\SubCommand\ViewListSubCommand;
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
use Unicorn\Upload\S3MultipartUploader;
use Windwalker\Core\Application\AppClient;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\DI\RequestBootableProviderInterface;
use Windwalker\Core\Package\AbstractPackage;
use Windwalker\Core\Package\PackageInstaller;
use Windwalker\Core\Renderer\RendererService;
use Windwalker\DI\Attributes\AttributeType;
use Windwalker\DI\BootableDeferredProviderInterface;
use Windwalker\DI\BootableProviderInterface;
use Windwalker\DI\Container;
use Windwalker\DI\ServiceProviderInterface;
use Windwalker\Form\Field\AbstractField;

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
        AbstractField::macro(
            'showon',
            function (array $values) {
                /** @var AbstractField $this */
                return $this->set('showon', $values);
            }
        );

        AbstractField::macro(
            'tooltip',
            function (string $title) {
                /** @var AbstractField $this */
                return $this->set('tooltip', $title);
            }
        );
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
        $container->prepareSharedObject(S3MultipartUploader::class);
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

        $isNext = $container->getParam('unicorn.modules.next') ?? false;
        $unicornPackage = $isNext ? '@windwalker-io/unicorn-next' : '@windwalker-io/unicorn';

        $imports = [
            '@systemjs' => 'vendor/systemjs/dist/system.js',
            '@unicorn/' => "vendor/$unicornPackage/dist/",
            '@unicorn' => "vendor/$unicornPackage/dist/unicorn.js",
            '@main' => "vendor/$unicornPackage/dist/unicorn.js",
            '@alpinejs' => 'vendor/alpinejs/dist/' . ($isNext ? 'module.esm.js' : 'cdn.js'),
            '@spectrum/' => 'vendor/spectrum-vanilla/dist/',
            '@spectrum' => 'vendor/spectrum-vanilla/dist/spectrum.min.js',
            '@tinymce' => 'vendor/tinymce/tinymce.js',
            // '@vue' => 'vendor/vue/dist/vue.global' . ($this->app->isDebug() ? '' : '.prod') . '.js',
            '@vue-animate' => 'vendor/@asika32764/vue-animate/dist/vue-animate.min.css',
        ];

        if (!$isNext) {
            $imports = [
                ...$imports,
                ...[
                    '@jquery' => 'vendor/jquery/dist/jquery.min.js',
                    '@spruce' => 'vendor/@ryangjchandler/spruce/dist/spruce.umd.js',
                    '@axios' => 'vendor/axios/dist/axios.js',
                    '@awesome-checkbox' => 'vendor/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css',
                    '@regenerator-runtime' => 'vendor/regenerator-runtime/runtime.js',
                    '@flatpickr/' => 'vendor/flatpickr/dist/',
                    '@core-js' => 'vendor/core-js-bundle/minified.js',
                    '@sortablejs' => 'vendor/sortablejs/Sortable.min.js',
                    '@cropperjs/' => 'vendor/cropperjs/dist/',
                    '@vuedraggable' => 'vendor/vuedraggable/dist/vuedraggable.umd.min.js',
                    '@vue2-animate' => 'vendor/vue2-animate/dist/vue2-animate.min.css',
                    '@current-script-polyfill' => 'vendor/current-script-polyfill/currentScript.js',
                ],
            ];
        }

        $container->mergeParameters('asset.import_map.imports', $imports);

        $container->mergeParameters(
            'renderer.aliases',
            [
                // '@theme' => 'ui.bootstrap5',
                '@title-bar' => '@theme::form.title-bar',
                '@filter-bar' => '@theme::grid.filter-bar',
                '@sort' => '@theme::grid.sort',
                '@toggle-all' => '@theme::grid.toggle-all',
                '@row-checkbox' => '@theme::grid.row-checkbox',
                '@order-sort' => '@theme::grid.order-sort',
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
                '@pagination-stats' => '@theme::components.pagination-stats',
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
                'order-sort' => '@order-sort',
                'order-control' => '@order-control',
                'save-order' => '@save-order',
                'state-button' => StateButtonComponent::class,
                'state-dropdown' => StateDropdownComponent::class,
                'publishing-dropdown' => PublishingDropdownComponent::class,
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
                'pagination-stats' => '@pagination-stats',
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
                    'unicorn:view-list' => ViewListSubCommand::class,
                    'unicorn:view-item' => ViewItemSubCommand::class,
                    'unicorn:route' => RouteSubCommand::class,
                    'unicorn:mvc-admin' => MvcAdminSubCommand::class,
                    'unicorn:mvc-simple' => MvcSimpleSubCommand::class,
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

<?php

declare(strict_types=1);

namespace Unicorn\Listener;

use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Asset\AssetItem;
use Windwalker\Core\Asset\AssetLink;
use Windwalker\Core\Asset\Event\AssetBeforeRender;
use Windwalker\Event\Attributes\EventSubscriber;
use Windwalker\Event\Attributes\ListenTo;

use Windwalker\Utilities\Str;

use function Windwalker\collect;

/**
 * The UnicornAssetListener class.
 */
#[EventSubscriber]
class UnicornAssetSubscriber
{
    /**
     * UnicornAssetListener constructor.
     */
    public function __construct(protected AppContext $app)
    {
    }

    #[ListenTo(AssetBeforeRender::class)]
    public function beforeRender(AssetBeforeRender $event): void
    {
        if ($event->type === AssetBeforeRender::TYPE_JS) {
            $this->handleJS($event);
        }
    }

    /**
     * handleJS
     *
     * @param  AssetBeforeRender  $event
     *
     * @return  void
     *
     * @throws \Windwalker\DI\Exception\DefinitionException
     */
    protected function handleJS(AssetBeforeRender $event): void
    {
        // Todo: Auto push route

        $script = $this->app->service(UnicornScript::class);
        // $asset = $event->assetService;
        // $internalScripts = $asset->getInternalScripts();
        $scripts = &$event->links;

        if (WINDWALKER_DEBUG) {
            $script->data('windwalker.debug', true);
        }

        if ($script->getData() !== []) {
            $store = json_encode($script->getData(), $this->app->isDebug() ? JSON_PRETTY_PRINT : 0);

            array_unshift(
                $scripts,
                new AssetLink()
                    ->setOption('body', "document.__unicorn = $store;")
            );
        }

        if ($script->initialise !== []) {
            $codes = collect($script->initialise)
                ->map('rtrim')
                ->filter('strlen')
                ->map(fn (string $s) => Str::ensureRight($s, ';'));

            if (!$script->next) {
                $codes[] = "u.trigger('ready');";
            }

            $script->importThen(
                '@main',
                (string) $codes->implode("\n"),
                false
            );
        } elseif ($script->importMain && !$script->next) {
            $script->importScript(
                '@main',
                false
            );
        }
    }
}

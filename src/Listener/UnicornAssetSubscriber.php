<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Listener;

use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Application\ApplicationInterface;
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
        if ($event->getType() === AssetBeforeRender::TYPE_JS) {
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
        $asset = $event->getAssetService();
        $scripts = $asset->getInternalScripts();

        if ($script->getData() !== []) {
            $store = json_encode($script->getData(), $this->app->isDebug() ? JSON_PRETTY_PRINT : 0);

            array_unshift($scripts, "document.__unicorn = $store;");

            $asset->setInternalScripts($scripts);
        }

        if ($script->initialise !== []) {
            $codes = collect($script->initialise)
                ->map('rtrim')
                ->filter('strlen')
                ->map(fn (string $s) => Str::ensureRight($s, ';'));

            $codes[] = "u.trigger('ready');";

            $script->importThen(
                '@main',
                (string) $codes->implode("\n"),
                false
            );
        } elseif ($script->importMain) {
            $script->importScript(
                '@main',
                false
            );
        }
    }
}

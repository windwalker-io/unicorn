<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Listener;

use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Asset\Event\AssetBeforeRender;
use Windwalker\Event\Attributes\EventSubscriber;
use Windwalker\Event\Attributes\ListenTo;

/**
 * The UnicornAssetListener class.
 */
#[EventSubscriber]
class UnicornAssetListener
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
            // Todo: Auto push route

            $script = $this->app->service(UnicornScript::class);
            $asset = $event->getAssetService();

            if ($script->getData() !== []) {
                $store = json_encode($script->getData(), $this->app->isDebug() ? JSON_PRETTY_PRINT : 0);

                $asset->internalJS("document.__unicorn = $store;");
            }
        }

    }
}

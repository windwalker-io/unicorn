<?php

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Windwalker\Core\Event\CoreEventAwareTrait;
use Windwalker\Event\EventAwareInterface;
use Windwalker\Event\EventAwareTrait;

/**
 * The RepositoryAction class.
 */
abstract class AbstractAction implements EventAwareInterface
{
    use CoreEventAwareTrait;
}

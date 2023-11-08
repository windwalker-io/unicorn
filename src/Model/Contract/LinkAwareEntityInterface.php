<?php

declare(strict_types=1);

namespace Unicorn\Model\Contract;

use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;

interface LinkAwareEntityInterface
{
    public function makeLink(Navigator $nav, string $ns = ''): RouteUri;
}

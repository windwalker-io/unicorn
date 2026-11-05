<?php

declare(strict_types=1);

$file = __DIR__ . '/../core/.php-cs-fixer.dist.php';

if (!file_exists($file)) {
    $file = __DIR__ . '/vendor/windwalker/core/.php-cs-fixer.dist.php';
}

return include $file;

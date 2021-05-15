<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

use Unicorn\Provider\StorageProvider;

return [
    'storage' => [
        'default' => 'local',

        'providers' => [
            StorageProvider::class
        ],

        'factories' => [
            'instances' => [
                'local' => ''
            ]
        ]
    ]
];

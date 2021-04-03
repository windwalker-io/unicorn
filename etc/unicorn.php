<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

return [
    'unicorn' => [
        'enabled' => true,

        'csrf' => [
            'auto_set_cookie' => true,
            'cookie_name' => 'XSRF-TOKEN'
        ],

        'listeners' => [
            //
        ],

        'providers' => [
            \Unicorn\UnicornPackage::class
        ]
    ]
];

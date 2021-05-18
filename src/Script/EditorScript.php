<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Asset\AbstractScript;

/**
 * The EditorScript class.
 */
class EditorScript extends AbstractScript
{
    public function tinymce(string $selector, array $options = []): void
    {
        if ($this->available()) {
            $optionsString = static::getJSObject($options);

            $js = <<<JS
            System.import('@main').then(function () {
              u.\$ui.tinymce.init('$selector', $optionsString);
            });
            JS;

            $this->internalJS($js);
        }
    }
}

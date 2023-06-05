<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Script;

use Windwalker\Core\Asset\AbstractScript;

/**
 * The EditorScript class.
 */
class EditorScript extends AbstractScript
{
    /**
     * EditorScript constructor.
     */
    public function __construct(protected UnicornScript $unicornScript)
    {
    }

    public function tinymce(string $selector, array $options = []): void
    {
        if ($this->available($selector)) {
            $optionsString = static::getJSObject($options);

            $this->unicornScript->importMainThen(
                "u.\$ui.tinymce.init('$selector', $optionsString);"
            );
        }
    }
}

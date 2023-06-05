<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Form\Field\TextareaField;

/**
 * The EditorField class.
 *
 * @method  $this  editorOptions(array $value = null)
 * @method  mixed  getEditorOptions()
 * @method  $this  toolbar(array $value = null)
 * @method  mixed  getToolbar()
 */
abstract class AbstractEditorField extends TextareaField
{
    /**
     * getAccessors
     *
     * @return  array
     *
     * @since   3.1.2
     */
    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'toolbar',
                'editorOptions',
            ]
        );
    }
}

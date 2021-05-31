<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\AbstractField;

/**
 * The ModalField class.
 */
class ModalField extends AbstractField
{
    public const TYPE_TAG = 'tag';
    public const TYPE_LIST = 'list';

    public function prepareInput(DOMElement $input): DOMElement
    {
        return $input;
    }
}

<?php

declare(strict_types=1);

namespace Unicorn\Form\Event;

use Unicorn\Form\FormFieldsBuilder;
use Windwalker\Database\Schema\Ddl\Column;
use Windwalker\Event\BaseEvent;
use Windwalker\Utilities\Accessible\AccessorBCTrait;

/**
 * The BuildFormFieldEvent class.
 */
class BuildFormFieldEvent extends BaseEvent
{
    use AccessorBCTrait;

    public function __construct(
        public Column $column,
        public FormFieldsBuilder $formFieldsBuilder,
        public string $label = '',
        public ?string $code = null,
    ) {
    }
}

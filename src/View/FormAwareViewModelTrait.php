<?php

declare(strict_types=1);

namespace Unicorn\View;

use Windwalker\Core\Form\FormFactory;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Form\Form;

trait FormAwareViewModelTrait
{
    #[Inject]
    protected FormFactory $formFactory;

    public function createForm(
        object|string|null $definition = null,
        ...$args
    ): Form {
        return $this->formFactory->create($definition, ...$args);
    }
}

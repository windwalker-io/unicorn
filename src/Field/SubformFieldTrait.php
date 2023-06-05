<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Form\Form;

/**
 * Trait SubformFieldTrait
 */
trait SubformFieldTrait
{
    protected ?Form $subform = null;

    public function getSubForm(): Form
    {
        $form = $this->subform ??= $this->createSubForm();

        $form->setNamespace($this->getNamespace(true));

        return $form;
    }

    public function createSubForm(): Form
    {
        $form = new Form();

        $parent = $this->getForm();

        if ($parent) {
            $form->setRenderer($parent->getRenderer());
            $form->setObjectBuilder($parent->getObjectBuilder());
        }

        return $form;
    }

    public function configureForm(callable $handler): static
    {
        $form = $handler($this->getSubForm());

        if ($form !== null) {
            $this->subform = $form;
        }

        return $this;
    }
}

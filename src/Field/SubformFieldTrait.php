<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
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

        $parent = $this->getForm();

        if ($parent) {
            $form->setNamespace($parent->getNamespace());
        }

        return $form;
    }

    public function createSubForm(): Form
    {
        return new Form();
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

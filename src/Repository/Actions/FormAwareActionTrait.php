<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Windwalker\Core\Form\Exception\ValidateFailException;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Service\FilterService;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Filter\Exception\ValidateException;
use Windwalker\Form\FieldDefinitionInterface;
use Windwalker\Form\Form;
use Windwalker\Utilities\Arr;

/**
 * Trait FormAwareActionTrait
 */
trait FormAwareActionTrait
{
    #[Inject]
    protected FormFactory $formFactory;

    #[Inject]
    protected FilterService $filterService;

    /**
     * filterBy
     *
     * @param  array  $data
     * @param  mixed  $form
     * @param  array  $args
     *
     * @return  array
     */
    public function filterBy(
        array $data,
        mixed $form,
        array $args = [],
        bool $keepFullData = false
    ): array {
        if (is_string($form) || $form instanceof FieldDefinitionInterface) {
            $form = $this->getForm($form, $args);
        }

        if ($form instanceof Form) {
            return $form->filter($data, $keepFullData);
        }

        if (is_array($form)) {
            if (array_is_list($form)) {
                return Arr::except($data, $form);
            }

            return $this->filterService->filter($data, $form);
        }

        return $data;
    }

    /**
     * validateBy
     *
     * @param  array  $data
     * @param  mixed  $form
     * @param  array  $args
     *
     * @return  bool
     */
    public function validateBy(array $data, mixed $form, array $args = []): bool
    {
        if (is_string($form) || $form instanceof FieldDefinitionInterface) {
            $form = $this->getForm($form, $args);
        }

        if ($form instanceof Form) {
            $resultSet = $form->validate($data);

            if ($resultSet->isFailure()) {
                $first = $resultSet->getFirstFailure();

                if ($first) {
                    throw new ValidateFailException(
                        sprintf(
                            'Field: %s validate fail.',
                            $first->getField()->getName()
                        )
                    );
                }
            }

            return true;
        }

        if (is_array($form)) {
            try {
                return $this->filterService->validate($data, $form);
            } catch (ValidateException $e) {
                throw new ValidateFailException($e->getMessage());
            }
        }

        return true;
    }

    /**
     * getForm
     *
     * @param  FieldDefinitionInterface|string|null  $form
     * @param  array                                 $args
     *
     * @return  Form
     */
    public function getForm(
        FieldDefinitionInterface|string|null $form = null,
        array $args = []
    ): Form {
        $id = $form;

        if (is_object($id)) {
            $id = $id::class;
        }

        $id = 'form: ' . ($id ?? 'default');

        return $this->cacheStorage[$id] ??= $this->formFactory->create($form, ...$args);
    }
}

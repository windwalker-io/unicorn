<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
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
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\BeforeSaveEvent;
use Windwalker\Utilities\Arr;

/**
 * The SaveAction class.
 */
class SaveAction extends AbstractDatabaseAction
{
    #[Inject]
    protected FormFactory $formFactory;

    #[Inject]
    protected FilterService $filterService;

    /**
     * processDataAndSave
     *
     * @param  array|object  $data
     * @param  mixed|null    $form
     * @param  array         $args
     *
     * @return  object
     */
    public function processDataAndSave(array|object $data, mixed $form = null, array $args = []): object
    {
        if (is_object($data)) {
            $entity = $data;
            $data   = $this->getEntityMapper()->extract($data);
        } else {
            $entity = $this->getEntityMapper()->createEntity();
        }

        $data = $this->processDataAndValidate($data, $form, $args);

        $entity = $this->getEntityMapper()->hydrate($data, $entity);

        return $this->save($entity);
    }

    /**
     * processDataAndValidate
     *
     * @param  array|object  $data
     * @param  mixed|null    $form
     * @param  array         $args
     *
     * @return  array
     */
    public function processDataAndValidate(array|object $data, mixed $form = null, array $args = []): array
    {
        $data = $this->prepareStore($data, $form, $args);

        $this->validateBy($data, $form, $args);

        return $data;
    }

    /**
     * save
     *
     * @param  array|object       $data
     * @param  array|string|null  $condFields
     * @param  bool               $updateNulls
     *
     * @return  object
     */
    public function save(array|object $data, array|string $condFields = null, bool $updateNulls = false): object
    {
        if (is_array($data)) {
            $entity = $this->getEntityMapper()->toEntity($data);
        } else {
            $entity = $data;
        }

        return $this->getEntityMapper()->saveOne($entity, $condFields, $updateNulls);
    }

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
        array $args = []
    ): array {
        if (is_string($form) || $form instanceof FieldDefinitionInterface) {
            $form = $this->getForm($form, $args);
        }

        if ($form instanceof Form) {
            return $form->filter($data);
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
                $results = $resultSet->getResults();
                $first   = array_pop($results);

                if ($first) {
                    throw new ValidateFailException(
                        sprintf(
                            'Field: %s fail.',
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
     * prepareFormStore
     *
     * @param  array                                 $data
     * @param  FieldDefinitionInterface|string|null  $definition
     * @param  array                                 $args
     *
     * @return  array
     */
    public function prepareFormStore(
        array $data,
        FieldDefinitionInterface|string|null $definition = null,
        array $args = []
    ): array {
        $form = $this->getForm($definition, $args);

        return $form->prepareStore($data);
    }

    /**
     * prepareStore
     *
     * @param  array                                 $data
     * @param  FieldDefinitionInterface|string|null  $definition
     * @param  array                                 $args
     *
     * @return  array
     */
    public function prepareStore(
        array $data,
        FieldDefinitionInterface|string|null $definition = null,
        array $args = []
    ): array {
        $data = $this->filterBy($data, $definition, $args);

        return $this->prepareFormStore($data, $definition, $args);
    }

    /**
     * getForm
     *
     * @param  FieldDefinitionInterface|string|null  $definition
     * @param  array                                 $args
     *
     * @return  Form
     */
    public function getForm(
        FieldDefinitionInterface|string|null $definition = null,
        array $args = []
    ): Form {
        $id = $definition;

        if (is_object($id)) {
            $id = $id::class;
        }

        $id = 'form: ' . ($id ?? 'default');

        return $this->cacheStorage[$id] ??= $this->formFactory->create($definition, ...$args);
    }

    public function beforeSave(callable $listener): static
    {
        return $this->on(BeforeSaveEvent::class, $listener);
    }

    public function afterSave(callable $listener): static
    {
        return $this->on(AfterSaveEvent::class, $listener);
    }

    public function beforeCreate(callable $listener): static
    {
        return $this->on(BeforeSaveEvent::class, function (BeforeSaveEvent $event) use ($listener) {
            if ($event->getType() === BeforeSaveEvent::TYPE_CREATE) {
                $listener($event);
            }
        });
    }

    public function afterCreate(callable $listener): static
    {
        return $this->on(AfterSaveEvent::class, function (AfterSaveEvent $event) use ($listener) {
            if ($event->getType() === AfterSaveEvent::TYPE_CREATE) {
                $listener($event);
            }
        });
    }

    public function beforeUpdate(callable $listener): static
    {
        return $this->on(BeforeSaveEvent::class, function (BeforeSaveEvent $event) use ($listener) {
            if ($event->getType() === BeforeSaveEvent::TYPE_UPDATE) {
                $listener($event);
            }
        });
    }

    public function afterUpdate(callable $listener): static
    {
        return $this->on(AfterSaveEvent::class, function (AfterSaveEvent $event) use ($listener) {
            if ($event->getType() === AfterSaveEvent::TYPE_UPDATE) {
                $listener($event);
            }
        });
    }
}

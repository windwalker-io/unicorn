<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Unicorn\Repository\Event\PrepareSaveEvent;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Form\FieldDefinitionInterface;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\BeforeSaveEvent;

/**
 * The SaveAction class.
 */
class SaveAction extends AbstractDatabaseAction
{
    use FormAwareActionTrait;

    public const FILTER_KEEP_FULL_DATA = 1 << 0;
    public const IGNORE_FILTER = 1 << 1;
    public const IGNORE_VALIDATE = 1 << 2;
    public const IGNORE_FORM_PREPARE = 1 << 3;

    /**
     * processDataAndSave
     *
     * @param  array|object  $data
     * @param  mixed|null    $form
     * @param  array         $args
     *
     * @return  object
     */
    public function processDataAndSave(
        array|object $data,
        mixed $form = null,
        array $args = [],
        int $options = 0
    ): object {
        if (is_object($data)) {
            $entity = $data;
            $data = $this->getEntityMapper()->extract($data);
        }

        $data = $this->processDataAndValidate($data, $form, $args, $options);

        return $this->save($data);
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
    public function processDataAndValidate(
        array|object $data,
        mixed $form = null,
        array $args = [],
        int $options = 0
    ): array {
        $data = $this->prepareStore($data, $form, $args, $options);

        if (!($options & static::IGNORE_VALIDATE)) {
            $this->validateBy($data, $form, $args);
        }

        return $data;
    }

    /**
     * save
     *
     * @param  array|object  $data
     * @param  array|string|null  $condFields
     * @param  int  $options
     *
     * @return  object
     */
    public function save(array|object $data, array|string $condFields = null, int $options = 0): object
    {
        $source = $data;

        // If is object, extract it.
        // If is array, do not extract again since EntityMapper::extract() will cast values.
        if (is_object($data)) {
            $data = $this->getEntityMapper()->extract($data);
        }

        $event = $this->emit(
            PrepareSaveEvent::class,
            compact('data', 'source', 'condFields', 'options')
        );

        return $this->getEntityMapper()
            ->saveOne(
                $event->getData(),
                $event->getCondFields(),
                $event->getOptions()
            );
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
        array $args = [],
        int $options = 0
    ): array {
        if (!($options & static::IGNORE_FILTER)) {
            $data = $this->filterBy($data, $definition, $args, (bool) ($options & static::FILTER_KEEP_FULL_DATA));
        }

        if (!($options & static::IGNORE_FORM_PREPARE)) {
            return $this->prepareFormStore($data, $definition, $args, $options);
        }

        return $data;
    }

    public function prepareSave(callable $listener): static
    {
        return $this->on(PrepareSaveEvent::class, $listener);
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

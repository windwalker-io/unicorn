<?php

declare(strict_types=1);

namespace Unicorn\View;

use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\ORM;

trait ORMAwareViewModelTrait
{
    #[Inject]
    protected ORM $orm;

    /**
     * @template T
     *
     * @param  class-string<T>  $entityClass
     * @param  array|null       $data
     *
     * @return  T|null
     * @throws \ReflectionException
     */
    public function tryEntity(string $entityClass, mixed $data): ?object
    {
        /** @var ?T $entity */
        $entity = $this->orm->tryEntity($entityClass, $data);

        return $entity;
    }

    /**
     * @template T
     *
     * @param  class-string<T>  $entityClass
     * @param  array|null       $data
     *
     * @return  T
     * @throws \ReflectionException
     */
    public function toEntity(string $entityClass, mixed $data): object
    {
        /** @var T $entity */
        $entity = $this->orm->toEntity($entityClass, $data);

        return $entity;
    }
}

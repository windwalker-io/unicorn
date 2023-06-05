<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 LYRASOFT.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Unicorn\Repository\DatabaseRepositoryInterface;
use Windwalker\ORM\EntityMapper;

/**
 * The AbstractDatabaseAction class.
 */
abstract class AbstractDatabaseAction extends AbstractAction
{
    protected ?string $entityClass = null;

    /**
     * SaveAction constructor.
     */
    public function __construct(protected DatabaseRepositoryInterface $repository)
    {
        //
    }

    public function getEntityMapper(): EntityMapper
    {
        if ($this->entityClass) {
            $mapper = $this->repository->getORM()->mapper($this->entityClass);
        } else {
            $mapper = $this->repository->getEntityMapper();
        }

        $mapper->addEventDealer($this);

        return $mapper;
    }

    /**
     * @return string|null
     */
    public function getEntityClass(): ?string
    {
        return $this->entityClass;
    }

    /**
     * @param  string|null  $entityClass
     *
     * @return  static  Return self to support chaining.
     */
    public function setEntityClass(?string $entityClass): static
    {
        $this->entityClass = $entityClass;

        return $this;
    }
}

<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
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
    /**
     * SaveAction constructor.
     */
    public function __construct(protected DatabaseRepositoryInterface $repository)
    {
        //
    }

    public function getEntityMapper(): EntityMapper
    {
        $mapper = $this->repository->getEntityMapper();

        $mapper->addEventDealer($this);

        return $mapper;
    }
}

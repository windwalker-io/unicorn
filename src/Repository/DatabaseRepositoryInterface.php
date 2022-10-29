<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Repository;

use Windwalker\Database\DatabaseAdapter;
use Windwalker\ORM\EntityMapper;
use Windwalker\ORM\ORM;

/**
 * Interface DatabaseRepositoryInterface
 */
interface DatabaseRepositoryInterface
{
    public function getDb(): DatabaseAdapter;

    public function getORM(): ORM;

    public function getEntityMapper(): EntityMapper;

    /**
     * getTable
     *
     * @return  string
     */
    public function getTable(): string;

    /**
     * getEntityClass
     *
     * @return  string
     */
    public function getEntityClass(): string;
}

<?php

/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Workflow;

use Windwalker\Core\Application\AppContext;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

/**
 * The WorkflowService class.
 */
class WorkflowFactory
{
    use InstanceCacheTrait;

    public function __construct(protected AppContext $app)
    {
    }

    public function getWorkflow(string|object $enum)
    {
        if (is_object($enum)) {
            $enum = $enum::class;
        }

        return $this->cacheStorage['workflow:' . $enum] ??= $this->createWorkflow($enum);
    }

    /**
     * @param  string|WorkflowTrait  $enumClass
     *
     * @return  WorkflowController
     */
    public function createWorkflow(string $enumClass): WorkflowController
    {
        $workflow = new WorkflowController();

        $enumClass::configureWorkflow($workflow);

        return $workflow;
    }
}

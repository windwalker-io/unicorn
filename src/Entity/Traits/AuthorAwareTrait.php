<?php

/**
 * Part of unicorn project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Entity\Traits;

use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Metadata\EntityMetadata;
use Windwalker\Utilities\Attributes\TraitOptions;

/**
 * Trait AuthorAwareTrait
 */
trait AuthorAwareTrait
{
    #[EntitySetup]
    public static function configureAuthorAware(EntityMetadata $metadata)
    {
        $options = TraitOptions::getOptions(static::class, AuthorAwareTrait::class);

        $metadata->cast(
            $options['column'],
            function () {

            }
        );

        // $metadata->getRelationManager()
        //     ->oneToMany()

        // todo: WIP
    }
}

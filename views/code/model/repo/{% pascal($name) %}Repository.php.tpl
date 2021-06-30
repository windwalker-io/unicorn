{% $phpOpen %}

/**
 * Part of starter project.
 *
 * @copyright    Copyright (C) 2021 __ORGANIZATION__.
 * @license        __LICENSE__
 */

declare(strict_types=1);

namespace App\Repository;

use App\Entity\{% pascal($name) %};
use Unicorn\Attributes\ConfigureAction;
use Unicorn\Attributes\Repository;
use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\ReorderAction;
use Unicorn\Repository\Actions\SaveAction;
use Unicorn\Repository\ListRepositoryInterface;
use Unicorn\Repository\ListRepositoryTrait;
use Unicorn\Repository\ManageRepositoryInterface;
use Unicorn\Repository\ManageRepositoryTrait;
use Unicorn\Selector\ListSelector;
use Windwalker\ORM\SelectorQuery;

/**
 * The {% pascal($name) %}Repository class.
 */
#[Repository(entityClass: {% pascal($name) %}::class)]
class {% pascal($name) %}Repository implements ManageRepositoryInterface, ListRepositoryInterface
{
    use ManageRepositoryTrait;
    use ListRepositoryTrait;

    /**
     * Configure List Selector.
     *
     * @param    SelectorQuery  $query
     * @param    ListSelector   $selector
     *
     * @return    void
     */
    protected function configureSelector(SelectorQuery $query, ListSelector $selector): void
    {
        $query->from({% pascal($name) %}::class);
    }

    #[ConfigureAction(SaveAction::class)]
    protected function configureSaveAction(SaveAction $action): void
    {
        //
    }

    #[ConfigureAction(ReorderAction::class)]
    protected function configureReorderAction(ReorderAction $action): void
    {
        //
    }

    #[ConfigureAction(BatchAction::class)]
    protected function configureBatchAction(BatchAction $action): void
    {
        //
    }
}

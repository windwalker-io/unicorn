{% $phpOpen %}

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace {% $ns %};

use App\Entity\{% pascal($name) %};
use Unicorn\Attributes\Repository;
use Unicorn\Repository\Actions\ActionsFactory;
use Unicorn\Repository\ListRepositoryInterface;
use Unicorn\Repository\ListRepositoryTrait;
use Unicorn\Repository\ManageRepositoryInterface;
use Unicorn\Repository\ManageRepositoryTrait;
use Unicorn\Selector\ListSelector;
use Windwalker\ORM\SelectorQuery;

/**
 * The {% pascal($name) %} class.
 */
#[Repository(entityClass: {% pascal($name) %}::class)]
class {% pascal($name) %}Repository implements ManageRepositoryInterface, ListRepositoryInterface
{
    use ManageRepositoryTrait;
    use ListRepositoryTrait;

    /**
     * Configure List Selector.
     *
     * @param  SelectorQuery  $query
     * @param  ListSelector   $selector
     *
     * @return  void
     */
    protected function configureSelector(SelectorQuery $query, ListSelector $selector): void
    {
        $query->from({% pascal($name) %}::class);
    }

    /**
     * Configure Actions.
     * - SaveAction
     * - ReorderAction
     * - BatchAction
     *
     * @param  ActionsFactory  $actionsFactory
     *
     * @return  void
     */
    protected function configureActions(ActionsFactory $actionsFactory): void
    {
        // $actionsFactory->configure(ReorderAction::class, callable);
    }
}

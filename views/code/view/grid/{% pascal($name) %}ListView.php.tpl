{% $phpOpen %}

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace {% $ns %};

use {% $ns %}\Form\GridForm;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

/**
 * The {% $className %} class.
 */
#[ViewModel(
    layout: [
        'default' => '{% kebab($name) %}-list',
        'modal' => '{% kebab($name) %}-modal',
    ],
    js: '{% kebab($name) %}-list.js'
)]
class {% pascal($name) %}ListView implements ViewModelInterface
{
    /**
     * CategoriesView constructor.
     *
     * @param  ORM               $orm
     * @param  {% pascal($name) %}Repository  $repository
     * @param  FormFactory       $formFactory
     */
    public function __construct(
        protected ORM $orm,
        #[Autowire]
        protected {% pascal($name) %}Repository $repository,
        protected FormFactory $formFactory
    ) {
    }

    public function prepare(AppContext $app, View $view): array
    {
        $state = $this->repository->getState();

        // Prepare Items
        $page     = $state->rememberFromRequest('page');
        $limit    = $state->rememberFromRequest('limit');
        $filter   = (array) $state->rememberFromRequest('filter');
        $search   = (array) $state->rememberFromRequest('search');
        $ordering = $state->rememberFromRequest('list_ordering') ?? static::getDefaultOrdering();

        $items = $this->repository->getListSelector()
            ->setFilters($filter)
            ->searchTextFor(
                $search['*'] ?? '',
                static::getSearchFields()
            )
            ->ordering($ordering)
            ->page($page)
            ->limit($limit);

        $pagination = $items->getPagination();

        $items = $items->getIterator(Collection::class);

        // Prepare Form
        $form = $this->formFactory->create(GridForm::class);
        $form->fill(compact('search', 'filter'));

        $showFilters = $this->showFilterBar($filter);

        return compact('items', 'pagination', 'form', 'showFilters', 'ordering');
    }

    /**
     * Get default ordering.
     *
     * @return  string
     */
    public static function getDefaultOrdering(): string
    {
        return '{% kebab($name) %}.id DESC';
    }

    /**
     * Get search fields.
     *
     * @return  string[]
     */
    public static function getSearchFields(): array
    {
        return [
            '{% kebab($name) %}.title',
            '{% kebab($name) %}.alias',
        ];
    }

    /**
     * Can show Filter bar
     *
     * @param  array  $filter
     *
     * @return  bool
     */
    public function showFilterBar(array $filter): bool
    {
        foreach ($filter as $value) {
            if ($value !== null && (string) $value !== '') {
                return true;
            }
        }

        return false;
    }
}

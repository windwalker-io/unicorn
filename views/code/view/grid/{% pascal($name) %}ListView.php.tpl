{% $phpOpen %}

declare(strict_types=1);

namespace {% $ns %};

use App\Entity\{% pascal($name) %};
use {% $ns %}\Form\GridForm;
use App\Repository\{% pascal($name) %}Repository;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\View\Contract\FilterAwareViewModelInterface;
use Windwalker\Core\View\SortableViewModelInterface;
use Windwalker\Core\View\Traits\FilterAwareViewModelTrait;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

/**
 * The {% pascal($name) %}ListView class.
 */
#[ViewModel(
    layout: [
        'default' => '{% kebab($name) %}-list',
        'modal' => '{% kebab($name) %}-modal',
    ],
    js: '{% kebab($name) %}-list.js'
)]
class {% pascal($name) %}ListView implements ViewModelInterface, FilterAwareViewModelInterface
{
    use TranslatorTrait;
    use FilterAwareViewModelTrait;

    public function __construct(
        protected ORM $orm,
        #[Autowire]
        protected {% pascal($name) %}Repository $repository,
        protected FormFactory $formFactory
    ) {
    }

    /**
     * Prepare view data.
     *
     * @param  AppContext  $app   The request app context.
     * @param  View        $view  The view object.
     *
     * @return  array
     */
    public function prepare(AppContext $app, View $view): array
    {
        $state = $this->repository->getState();

        // Prepare Items
        $page     = $state->rememberFromRequest('page');
        $limit    = $state->rememberFromRequest('limit') ?? 30;
        $filter   = (array) $state->rememberFromRequest('filter');
        $search   = (array) $state->rememberFromRequest('search');
        $ordering = $state->rememberFromRequest('list_ordering') ?? $this->getDefaultOrdering();

        $items = $this->repository->getListSelector()
            ->setFilters($filter)
            ->searchTextFor(
                $search['*'] ?? '',
                $this->getSearchFields()
            )
            ->ordering($ordering)
            ->page($page)
            ->limit($limit)
            ->setDefaultItemClass({% pascal($name) %}::class);

        $pagination = $items->getPagination();

        // Prepare Form
        $form = $this->formFactory->create(GridForm::class);
        $form->fill(compact('search', 'filter'));

        $showFilters = $this->isFiltered($filter);

        return compact('items', 'pagination', 'form', 'showFilters', 'ordering');
    }

    /**
     * Get default ordering.
     *
     * @return  string
     */
    public function getDefaultOrdering(): string
    {
        return '{% snake($name) %}.id DESC';
    }

    /**
     * Get search fields.
     *
     * @return  string[]
     */
    public function getSearchFields(): array
    {
        return [
            '{% snake($name) %}.id',
            '{% snake($name) %}.title',
            '{% snake($name) %}.alias',
        ];
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle(
            $this->trans('unicorn.title.grid', title: '{% pascal($name) %}')
        );
    }
}

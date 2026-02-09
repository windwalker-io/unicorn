{% $phpOpen %}

declare(strict_types=1);

namespace {% $ns %};

use App\Entity\{% pascal($name) %};
use App\Repository\{% pascal($name) %}Repository;
use Unicorn\View\FormAwareViewModelTrait;
use Unicorn\View\ORMAwareViewModelTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Attributes\ViewPrepare;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\View\Contract\FilterAwareViewModelInterface;
use Windwalker\Core\View\Traits\FilterAwareViewModelTrait;
use Windwalker\Core\View\View;
use Windwalker\DI\Attributes\Autowire;

/**
 * The {% pascal($name) %}ListView class.
 */
#[ViewModel(
    layout: [
        'default' => '{% kebab($name) %}-list',
        'modal' => '{% kebab($name) %}-modal',
    ],
    js: '{% kebab($name) %}-list.ts'
)]
class {% pascal($name) %}ListView implements FilterAwareViewModelInterface
{
    use TranslatorTrait;
    use FilterAwareViewModelTrait;
    use ORMAwareViewModelTrait;
    use FormAwareViewModelTrait;

    public function __construct(
        #[Autowire]
        protected {% pascal($name) %}Repository $repository,
    ) {
    }

    #[ViewPrepare]
    public function prepare(AppContext $app, View $view): array
    {
        $state = $this->repository->getState();

        // Prepare Items
        $page     = $state->rememberFromRequest('page');
        $limit    = $state->rememberFromRequest('limit') ?? 30;
        $filter   = (array) $state->rememberMergeRequest('filter');
        $search   = (array) $state->rememberMergeRequest('search');
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
        $form = $this->createForm({% pascal($name) %}GridForm::class)
            ->fill(compact('search', 'filter'));

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

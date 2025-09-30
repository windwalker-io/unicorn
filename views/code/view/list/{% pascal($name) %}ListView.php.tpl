{% $phpOpen %}

declare(strict_types=1);

namespace {% $ns %};

use App\Entity\{% pascal($name) %};
use App\Repository\{% pascal($name) %}Repository;
use Unicorn\View\ORMAwareViewModelTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Attributes\ViewPrepare;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;

#[ViewModel(
    layout: '{% kebab($name) %}-list',
    js: '{% kebab($name) %}-list.js'
)]
class {% pascal($name) %}ListView
{
    use ORMAwareViewModelTrait;

    public function __construct(
        #[Autowire]
        protected {% pascal($name) %}Repository $repository,
    ) {
        //
    }

    #[ViewPrepare]
    public function prepare(AppContext $app, View $view): array
    {
        $page     = $app->input('page');
        $limit    = $app->input('limit') ?? 30;
        $ordering = $this->getDefaultOrdering();

        $items = $this->repository->getListSelector()
            ->addFilters([])
            ->ordering($ordering)
            ->page($page)
            ->limit($limit)
            ->setDefaultItemClass({% pascal($name) %}::class);

        $pagination = $items->getPagination();

        return compact('items', 'pagination');
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

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle('{% pascal($name) %} List');
    }
}

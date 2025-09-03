{% $phpOpen %}

declare(strict_types=1);

namespace {% $ns %};

use App\Entity\{% pascal($name) %};
use {% $ns %}\Form\EditForm;
use App\Repository\{% pascal($name) %}Repository;
use Unicorn\View\FormAwareViewModelTrait;
use Unicorn\View\ORMAwareViewModelTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Attributes\ViewPrepare;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\View\View;
use Windwalker\DI\Attributes\Autowire;

/**
 * The {% pascal($name) %}EditView class.
 */
#[ViewModel(
    layout: '{% kebab($name) %}-edit',
    js: '{% kebab($name) %}-edit.js'
)]
class {% pascal($name) %}EditView
{
    use TranslatorTrait;
    use ORMAwareViewModelTrait;
    use FormAwareViewModelTrait;

    public function __construct(
        #[Autowire] protected {% pascal($name) %}Repository $repository,
    ) {
    }

    #[ViewPrepare]
    public function prepare(AppContext $app, View $view): mixed
    {
        $id = $app->input('id');

        /** @var ?{% pascal($name) %} $item */
        $item = $this->repository->getItem($id);

        // Bind item for injection
        $view[{% pascal($name) %}::class] = $item;

        $form = $this->createForm(EditForm::class)
            ->fill(
                [
                    'item' => $this->repository->getState()->getAndForget('edit.data')
                        ?: $this->orm->extractEntity($item)
                ]
            );

        return compact('form', 'id', 'item');
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle(
            $this->trans('unicorn.title.edit', title: '{% pascal($name) %}')
        );
    }
}

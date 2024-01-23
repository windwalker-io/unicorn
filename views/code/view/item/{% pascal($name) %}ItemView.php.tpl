{% $phpOpen %}

declare(strict_types=1);

namespace {% $ns %};

use App\Entity\{% pascal($name) %};
use App\Repository\{% pascal($name) %}Repository;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

#[ViewModel(
    layout: '{% kebab($name) %}-item',
    js: '{% kebab($name) %}-item.js'
)]
class {% pascal($name) %}ItemView implements ViewModelInterface
{
    public function __construct(
        protected ORM $orm,
        #[Autowire] protected {% pascal($name) %}Repository $repository
    ) {
        //
    }

    /**
     * Prepare View.
     *
     * @param  AppContext  $app   The web app context.
     * @param  View        $view  The view object.
     *
     * @return  mixed
     */
    public function prepare(AppContext $app, View $view): array
    {
        $id = $app->input('id');

        $item = $this->repository->mustGetItem($id);

        $view[$item::class] = $item;

        return compact('item');
    }

    #[ViewMetadata]
    public function prepareMetadata(HtmlFrame $htmlFrame, {% pascal($name) %} $item): void
    {
        $htmlFrame->setTitle($item->title ?: '{% pascal($name) %} Item');
    }
}

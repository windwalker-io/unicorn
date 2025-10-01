{% $phpOpen %}

declare(strict_types=1);

namespace {% $ns %};

use App\Entity\{% pascal($name) %};
use App\Repository\{% pascal($name) %}Repository;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Attributes\ViewPrepare;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\View\View;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

#[ViewModel(
    layout: '{% kebab($name) %}-item',
    js: '{% kebab($name) %}-item.ts'
)]
class {% pascal($name) %}ItemView
{
    public function __construct(
        protected ORM $orm,
        #[Autowire] protected {% pascal($name) %}Repository $repository
    ) {
        //
    }

    #[ViewPrepare]
    public function prepare(AppContext $app, View $view): array
    {
        $id = $app->input('id');

        /** @var {% pascal($name) %} $item */
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

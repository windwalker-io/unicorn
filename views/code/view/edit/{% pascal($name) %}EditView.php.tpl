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
use {% $ns %}\Form\EditForm;
use App\Repository\{% pascal($name) %}Repository;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

/**
 * The {% pascal($name) %}EditView class.
 */
#[ViewModel(
    layout: '{% kebab($name) %}-edit',
    js: '{% kebab($name) %}-edit.js'
)]
class {% pascal($name) %}EditView implements ViewModelInterface
{
    public function __construct(
        protected ORM $orm,
        protected FormFactory $formFactory,
        protected Navigator $nav,
        #[Autowire] protected {% pascal($name) %}Repository $repository
    ) {
    }

    /**
     * Prepare
     *
     * @param  AppContext  $app
     * @param  View        $view
     *
     * @return  mixed
     */
    public function prepare(AppContext $app, View $view): mixed
    {
        $id = $app->input('id');

        $item = $this->repository->getItem($id);

        $form = $this->formFactory
            ->create(EditForm::class)
            ->setNamespace('item')
            ->fill(
                $this->repository->getState()->getAndForget('edit.data')
                    ?: $this->orm->extractEntity($item)
            );

        $this->prepareMetadata($app, $view->getHtmlFrame());

        return compact('form', 'id', 'item');
    }

    /**
     * Prepare Metadata and HTML Frame.
     *
     * @param  AppContext  $app
     * @param  HtmlFrame   $htmlFrame
     *
     * @return  void
     */
    protected function prepareMetadata(AppContext $app, HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle(
            $this->trans('unicorn.title.grid', title: '{% pascal($name) %}')
        );
    }
}

{% $phpOpen %}

declare(strict_types=1);

namespace {% $ns %};

use App\Repository\{% pascal($name) %}Repository;
use Unicorn\Controller\CrudController;
use Unicorn\Controller\GridController;
use Unicorn\Repository\Event\PrepareSaveEvent;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\Event\AfterSaveEvent;

#[Controller()]
class {% pascal($name) %}Controller
{
    public function save(
        AppContext $app,
        CrudController $controller,
        Navigator $nav,
        #[Autowire] {% pascal($name) %}Repository $repository,
    ): mixed {
        $form = $app->make({% pascal($name) %}EditForm::class);

        $controller->prepareSave(
            function (PrepareSaveEvent $event) {
                //
            }
        );

        $controller->afterSave(
            function (AfterSaveEvent $event) {
                //
            }
        );

        $uri = $app->call($controller->saveWithNamespace(...), compact('repository', 'form'));

        return match ($app->input('task')) {
            'save2close' => $nav->to('{% snake($name) %}_list'),
            default => $uri,
        };
    }

    public function delete(
        AppContext $app,
        #[Autowire] {% pascal($name) %}Repository $repository,
        CrudController $controller
    ): mixed {
        return $app->call($controller->delete(...), compact('repository'));
    }

    public function filter(
        AppContext $app,
        #[Autowire] {% pascal($name) %}Repository $repository,
        GridController $controller
    ): mixed {
        return $app->call($controller->filter(...), compact('repository'));
    }

    public function batch(
        AppContext $app,
        #[Autowire] {% pascal($name) %}Repository $repository,
        GridController $controller
    ): mixed {
        $task = $app->input('task');
        $data = match ($task) {
            'publish' => ['state' => 1],
            'unpublish' => ['state' => 0],
            default => null
        };

        return $app->call($controller->batch(...), compact('repository', 'data'));
    }

    public function copy(
        AppContext $app,
        #[Autowire] {% pascal($name) %}Repository $repository,
        GridController $controller
    ): mixed {
        return $app->call($controller->copy(...), compact('repository'));
    }
}

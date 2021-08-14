{% $phpOpen %}

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace {% $ns %};

use {% $ns %}\Form\EditForm;
use App\Repository\{% pascal($name) %}Repository;
use Unicorn\Controller\CrudController;
use Unicorn\Controller\GridController;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Autowire;

/**
 * The {% pascal($name) %}Controller class.
 */
#[Controller()]
class {% pascal($name) %}Controller
{
    public function save(
        AppContext $app,
        CrudController $controller,
        Navigator $nav,
        #[Autowire] {% pascal($name) %}Repository $repository,
        #[Autowire] EditForm $form,
    ): mixed {
        $uri = $app->call([$controller, 'save'], compact('repository', 'form'));

        switch ($app->input('task')) {
            case 'save2close':
                return $nav->to({% pascal($name) %}ListView::class);

            case 'save2new':
                return $nav->to({% pascal($name) %}EditView::class)->var('new', 1);

            case 'save2copy':
                $controller->rememberForClone($app, $repository);
                return $nav->self($nav::WITHOUT_VARS)->var('new', 1);

            default:
                return $uri;
        }
    }

    public function delete(
        AppContext $app,
        #[Autowire] {% pascal($name) %}Repository $repository,
        CrudController $controller
    ): mixed {
        return $app->call([$controller, 'delete'], compact('repository'));
    }

    public function filter(
        AppContext $app,
        #[Autowire] {% pascal($name) %}Repository $repository,
        GridController $controller
    ): mixed {
        return $app->call([$controller, 'filter'], compact('repository'));
    }

    public function batch(
        AppContext $app,
        #[Autowire] {% pascal($name) %}Repository $repository,
        GridController $controller
    ): mixed {
        $data = match ($app->input('task')) {
            'publish' => ['state' => 1],
            'unpublish' => ['state' => 0],
            default => null
        };

        return $app->call([$controller, 'batch'], compact('repository', 'data'));
    }

    public function copy(
        AppContext $app,
        #[Autowire] {% pascal($name) %}Repository $repository,
        GridController $controller
    ): mixed {
        return $app->call([$controller, 'copy'], compact('repository'));
    }
}

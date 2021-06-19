{% $phpOpen %}

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace {% $ns %};

use Unicorn\Controller\CrudController;
use Unicorn\Controller\GridController;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\DI\Attributes\Autowire;
use {% $ns %}\Form\EditForm;

/**
 * The {% pascal($name) %}Controller class.
 */
#[Controller()]
class {% pascal($name) %}Controller
{
    public function save(AppContext $app, #[Autowire] {% pascal($name) %}Repository $repository, #[Autowire] EditForm $form, CrudController $controller): mixed
    {
        return $app->call([$controller, 'save'], compact('repository', 'form'));
    }

    public function delete(AppContext $app, #[Autowire] {% pascal($name) %}Repository $repository, CrudController $controller): mixed
    {
        return $app->call([$controller, 'delete'], compact('repository'));
    }

    public function filter(AppContext $app, #[Autowire] {% pascal($name) %}Repository $repository, GridController $controller): mixed
    {
        return $app->call([$controller, 'filter'], compact('repository'));
    }

    public function batch(AppContext $app, #[Autowire] {% pascal($name) %}Repository $repository, GridController $controller): mixed
    {
        $task = $app->input('task');
        $data = match ($task) {
            'publish' => ['state' => 1],
            'unpublish' => ['state' => 0],
            default => null
        };

        return $app->call([$controller, 'batch'], compact('repository', 'data'));
    }

    public function copy(AppContext $app, #[Autowire] {% pascal($name) %}Repository $repository, GridController $controller): mixed
    {
        return $app->call([$controller, 'copy'], compact('repository'));
    }
}

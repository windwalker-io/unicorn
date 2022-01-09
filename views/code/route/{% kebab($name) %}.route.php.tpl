{% $phpOpen %}

namespace App\Routes;

use {% $ns %}\{% pascal($name) %}Controller;
use {% $ns %}\{% pascal($name) %}EditView;
use {% $ns %}\{% pascal($name) %}ListView;
use Windwalker\Core\Router\RouteCreator;

/** @var  RouteCreator $router */

$router->group('{% kebab($name) %}')
    ->extra('menu', ['sidemenu' => '{% snake($name) %}_list'])
    ->register(function (RouteCreator $router) {
        $router->any('{% snake($name) %}_list', '/{% kebab($name) %}/list')
            ->controller({% pascal($name) %}Controller::class)
            ->view({% pascal($name) %}ListView::class)
            ->postHandler('copy')
            ->putHandler('filter')
            ->patchHandler('batch');

        $router->any('{% snake($name) %}_edit', '/{% kebab($name) %}/edit[/{id}]')
            ->controller({% pascal($name) %}Controller::class)
            ->view({% pascal($name) %}EditView::class);
    });

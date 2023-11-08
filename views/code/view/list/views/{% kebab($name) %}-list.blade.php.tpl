{% $phpOpen %}

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        {% pascal($name) %}ListView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use App\Entity\{% pascal($name) %};
use {% $ns %}\{% pascal($name) %}ListView;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $item       {% pascal($name) %}
 * @var $pagination Pagination
 */

{% $phpClose %}

@extends('global.body')

@section('content')
    <div class="container my-4">
        <h2>{% pascal($name) %}List view</h2>

        <ul>
            @foreach ($items as $item)
            <li>
                <a href="{{ $nav->to('{% snake($name) %}_item')->id($item->getId()) }}">
                    {{ $item->getTitle() }}
                </a>
            </li>
            @endforeach
        </ul>

        <x-pagination :pagination="$pagination"></x-pagination>
    </div>
@stop

{% $phpOpen %}

/**
 * Global variables
 * --------------------------------------------------------------
 * @@var $app       AppContext      Application context.
 * @@var $vm        object          The view model object.
 * @@var $uri       SystemUri       System Uri information.
 * @@var $chronos   ChronosService  The chronos datetime service.
 * @@var $nav       Navigator       Navigator object to build route.
 * @@var $asset     AssetService    The Asset manage service.
 * @@var $lang      LangService     The language translation service.
 */

declare(strict_types=1);

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

$callback = $app->input('callback');
{% $phpClose %}

@@extends('admin.global.pure')

@@section('superbody')
    <form id="grid-form" action="" x-data="{ grid: $store.grid }"
        x-ref="gridForm"
        data-ordering="{{ $ordering }}"
        method="post">

        <x-filter-bar :form="$form" :open="$showFilters"></x-filter-bar>

        <div>
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>
                        <x-sort field="{% kebab($name) %}.title">
                            Title
                        </x-sort>
                    </th>
                    <th>
                        <x-sort field="{% kebab($name) %}.state">
                            State
                        </x-sort>
                    </th>
                    <th>
                        <x-sort field="{% kebab($name) %}.category_id">
                            Category
                        </x-sort>
                    </th>
                    <th>
                        <x-sort field="category.id">
                            ID
                        </x-sort>
                    </th>
                </tr>
                </thead>

                <tbody>
                @@foreach ($items as $i => $item)
                    @@php($data = [
                        'title' => $item->title,
                        'value' => $item->id,
                        'image' => $item->image,
                    ])
                    <tr>
                        <td>
                            <a href="javascript://"
                                onclick="parent.{{ $callback }}({{ json_encode($data) }})">
                                <span class="fa fa-angle-right text-muted"></span>
                                {{ $item->title }}
                            </a>
                        </td>
                        <th>
                            {{ $item->state }}
                        </th>
                        <td>
                            {{ $item->category->title ?? '' }}
                        </td>
                        <td>
                            {{ $item->id }}
                        </td>
                    </tr>
                @@endforeach
                </tbody>

                <tfoot>
                <tr>
                    <td colspan="20">
                        {!! $pagination->render() !!}
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>

        <div class="d-none">
            @@formToken
        </div>

        <x-batch-modal :form="$form" namespace="batch"></x-batch-modal>
    </form>

@@stop

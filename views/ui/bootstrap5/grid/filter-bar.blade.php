<?php

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var $view      ViewModel       The view modal object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

declare(strict_types=1);

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Form\Form;

/**
 * @var Form $form
 */

$open ??= false;
$searchInput ??= 'search/*';

$searchBlock ??= null;
$filterBlock ??= null;
?>

<div class="c-filter-bar mb-4"
    data-open="{{ (int) $open }}"
    x-cloak
    x-id="filter-bar"
    x-ref="filterbar"
    x-data="{ open: $el.dataset.open === '1', grid: $store.{{ $store ?? 'grid' }} }"
    x-init="
    $watch('open', function (open) {
        grid.toggleFilters(open, $refs.filterForm);
    });
    grid.toggleFilters(open, $refs.filterForm);
    "
>
    <div class="c-filter-bar-top d-flex">
        <div class="c-filter-bar__top-start d-flex">
            {{-- Search --}}
            @if ($searchBlock !== false)
                @if ($searchBlock === null)
                    <div class="input-group">
                        {!! $form->getField($searchInput)->renderInput() !!}

                        <button type="button" class="btn btn-outline-secondary"
                            data-search-button
                            data-bs-toggle="tooltip"
                            title="Search"
                            @click="$store.grid.sendFilter()"
                        >
                            <i class="fa fa-magnifying-glass"></i>
                        </button>
                    </div>
                @else
                    {!! $searchBlock ?? '' !!}
                @endif
            @endif

            {{-- Buttons --}}
            @if ($filterBlock !== false)
                <div class="btn-group ms-3 ml-3">
                    <button type="button" class="btn text-nowrap"
                        data-filter-toggle-button
                        :class="[ open ? 'btn-dark' : 'btn-outline-secondary' ]"
                        @click="open = !open"
                    >
                        Filters
                        <span class="filter-button-icon fa"
                            :class="[ open ? 'fa-angle-up' : 'fa-angle-down' ]"
                        ></span>
                    </button>
                    <button type="button" class="btn btn-outline-secondary"
                        data-filter-clear-button
                        {{--@click="gridState.uniform.clearAll($refs.filterbar)"--}}
                        @click="$store.grid.clearFilters($refs.filterbar)"
                    >
                        <span class="fa fa-times"></span>
                    </button>
                </div>
            @endif
        </div>

        {{-- End --}}
        <div class="c-filter-bar__top-end ms-auto">
            {!! $end ?? '' !!}
        </div>
    </div>

    {{-- Filters --}}
    @if ($filterBlock !== false)
    <div class="c-filter-bar__filters" x-ref="filterForm" style="display: none;">
        <div class="pt-3">
            @php($fields = iterator_to_array($form->getFields(\Windwalker\Utilities\Symbol::none(), 'filter')))

            @if (count($fields))
                <div class="row c-filter-bar__filter-group">
                    @foreach ($fields as $field)
                        <div class="col-lg-3 col-sm-6 mb-3">
                            <x-field :field="$field" floating></x-field>
                        </div>
                    @endforeach
                </div>
            @endif

            @foreach ($form->getFieldsets() as $fieldset)
                @php($fields = iterator_to_array($form->getFields($fieldset->getName(), 'filter')))

                @if (count($fields))
                    <div class="mt-3">
                        <h4>{{ $fieldset->getTitle() }}</h4>

                        <div class="row c-filter-bar__filter-group">
                            @foreach ($fields as $field)
                                <div class="col-lg-3 col-sm-6 mb-3">
                                    <x-field :field="$field" floating></x-field>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
            @endforeach
        </div>
    </div>
    @endif
</div>

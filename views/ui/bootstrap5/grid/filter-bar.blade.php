<?php

declare(strict_types=1);

namespace App\View;

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
$size ??= null;

$fieldsCount = $form->countFields(null, 'filter');

if ($fieldsCount === 0 && $filterBlock === null) {
    $filterBlock = false;
}

/** @var \Windwalker\Edge\Component\ComponentAttributes $attributes */
$attributes = $attributes->except(
    [
        'searchBlock',
        'filterBlock',
        'size',
        'open',
        'searchInput',
        'form',
    ]
);
$attributes = $attributes->class('c-filter-bar mb-4');
?>

<div
    data-open="{{ (int) $open }}"
    x-cloak
    x-title="filter-bar"
    x-ref="filterbar"
    x-data="{ open: $el.dataset.open === '1', grid: $store.{{ $store ?? 'grid' }} }"
    x-init="
    $watch('open', function (open) {
        grid.toggleFilters(open, $refs.filterForm);
    });
    grid.toggleFilters(open, $refs.filterForm);
    $watch('grid.chcked', function (v) { consoloe.log(v) }, { deep: true })
    "
    {!! $attributes !!}
>
    <div class="c-filter-bar-top d-flex">
        <div class="c-filter-bar__top-start d-flex">
            {{-- Search --}}
            @if ($searchBlock !== false)
                @if ($searchBlock === null)
                    <x-input-group class="me-3 input-group-{{ $size }}" tag-name="span">
                        <x-input :field="$form[$searchInput]"></x-input>

                        <x-slot name="end">
                            <button type="submit" class="btn btn-outline-secondary"
                                data-search-button
                                data-bs-toggle="tooltip"
                                title="@lang('unicorn.grid.search.button.desc')"
                            >
                                <i class="fa fa-magnifying-glass"></i>
                            </button>
                        </x-slot>
                    </x-input-group>
                @else
                    {!! $searchBlock ?? '' !!}
                @endif
            @endif

            {{-- Buttons --}}
            @if ($filterBlock !== false || $searchBlock !== false)
            <div class="btn-group btn-group-{{ $size }} me-3">
                @if ($filterBlock !== false)
                    <button type="button" class="btn text-nowrap btn-outline-secondary"
                        :class="{ active: open }"
                        @click="open = !open"
                        data-bs-toggle="tooltip"
                        title="@lang('unicorn.grid.filter.button.desc')"
                    >
                        @lang('unicorn.grid.filter.button.text')
                        <span class="filter-button-icon fa"
                            :class="[ open ? 'fa-angle-up' : 'fa-angle-down' ]"
                        ></span>
                    </button>
                @endif

                <button type="button" class="btn btn-outline-secondary"
                    @click="$store.grid.clearFilters($refs.filterbar)"
                    data-bs-toggle="tooltip"
                    title="@lang('unicorn.grid.clear.button.desc')"
                >
                    <span class="fa fa-times"></span>
                </button>
            </div>
            @endif

            {{-- Start --}}
            @if ($start ?? null)
                <div class="c-filter-bar__top-start">
                    {!! $start !!}
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
        @if ($filterBlock === null)
            <div class="c-filter-bar__filters" x-ref="filterForm" style="display: none;">
                <div class="pt-3">
                    @php($fields = iterator_to_array($form->getFields(\Windwalker\Utilities\Symbol::none(), 'filter')))

                    @if (count($fields))
                        <div class="row c-filter-bar__filter-group">
                            @foreach ($fields as $field)
                                <div class="col-lg-3 col-sm-6 mb-3">
                                    <x-field :field="$field"></x-field>
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
        @else
            {!! $filterBlock !!}
        @endif
    @endif
</div>

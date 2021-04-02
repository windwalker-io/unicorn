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

?>

@push('script')
    <script type="module">
        import('@alpinejs');
    </script>
@endpush

<div class="c-filter-bar mb-4" x-data="{ open: false }" x-id="filter-bar">
    <div class="c-filter-bar-top d-flex">
        <div class="c-filter-bar__top-start d-flex">
            <div class="input-group">
                {!! $form->getField('search/content')->renderInput() !!}

                <button class="btn btn-outline-secondary"
                    data-search-button>
                    Search
                </button>
            </div>

            <div class="btn-group ms-3">
                <button type="button" class="btn text-nowrap"
                    data-filter-toggle-button
                    :class="[ open ? 'btn-dark' : 'btn-outline-secondary' ]"
                    @@click="open = !open"
                >
                    Filters
                    <span class="filter-button-icon fa"
                        x-bind:class="[ open ? 'fa-angle-up' : 'fa-angle-down' ]"
                    ></span>
                </button>
                <button type="button" class="btn btn-outline-secondary"
                    data-filter-clear-button
                >
                    <span class="fa fa-times"></span>
                </button>
            </div>
        </div>

        <div class="c-filter-bar__top-end ms-auto">
            {!! $topEnd ?? '' !!}
        </div>
    </div>

    <div class="c-filter-bar__filters mt-3" x-show="open"
        x-transition:enter="fadeIn"
        x-transition:leave="fadeOut"
        style="animation-duration: .3s"
    >
        @php($fields = iterator_to_array($form->getFields(\Windwalker\Utilities\Symbol::none(), 'filter')))

        @if (count($fields))
            <div class="row c-filter-bar__filter-group">
                @foreach ($fields as $field)
                    <div class="col-lg-3 col-md-6">
                        {!! $field->renderInput() !!}
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
                            <div class="col-lg-3 col-md-6">
                                {!! $field->renderInput() !!}
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        @endforeach
    </div>
</div>

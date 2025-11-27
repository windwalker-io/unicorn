<?php

declare(strict_types=1);

namespace App\view;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var $vm        object          The view model object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $pagination Pagination
 */

$attributes->props('pagination');

$attributes = $attributes->class('c-pagination-jump gap-2');
$self = (string) $nav->self()->var('page', '{page}');
?>

@if ($pagination->getPages() > 1)
    @once
        <script>
        document.addEventListener('DOMContentLoaded', () => {
            for (const el of document.querySelectorAll('[data-pagination-jump]')) {
                el.querySelector('button').addEventListener('click', () => {
                    const url = new URL(location.href);
                    url.searchParams.set('page', el.querySelector('input').value || 1);
                    window.location.href = url;
                });

                el.querySelector('input').addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        el.querySelector('button').click();
                    }
                });
            }
        });
    </script>
    @endonce

    <div {!! $attributes !!}>
        <div class="input-group" data-pagination-jump>
            <div class="input-group-text">前往</div>
            <input type="number"
                name="page"
                value="{{ $pagination->getCurrent() }}"
                class="form-control"
                style="max-width: 100px" />
            <button type="button" class="btn btn-primary">
                GO
            </button>
        </div>
    </div>
@endif

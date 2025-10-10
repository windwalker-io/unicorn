<?php

declare(strict_types=1);

namespace App\View;

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

use Unicorn\Script\BootstrapScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Edge\Component\ComponentAttributes;

use function Windwalker\uid;

/**
 * @var $attributes ComponentAttributes
 */

$props = $attributes->props(
    'variant',
    'keepactive',
    'fill',
    'nav-target',
    'nav-attrs'
);

$id ??= 'c-tabs-' . uid();
$variant ??= 'tabs';
$fill ??= null;
$keepactive ??= null;
$navTarget ??= null;
$navAttrs ??= '';

if ($keepactive !== null) {
    if (!is_string($keepactive)) {
        $keepactive = '#admin-form';
    }

    // $app->service(BootstrapScript::class)->keepTab($keepactive);
}

$attributes = $attributes->class('d-flex flex-column gap-4');
$attributes['id'] = $id;

$directiveOptions = [
    'variant' => $variant,
    'fill' => $fill,
    'navTarget' => $navTarget,
    'navAttrs' => $navAttrs,
    'keepactive' => $keepactive,
];

$attributes['uni-tabs-autonav'] = json_encode($directiveOptions);
?>

<div {!! $attributes !!}>
    <div class="tab-content">
        {!! $slot ?? '' !!}
    </div>
</div>

@push('script')
    <script data-macro="unicorn.bs5.tabs" lang="ts" type="module">
        import { module, useUniDirective, useBs5KeepTab } from '@windwalker-io/unicorn-next';

        useUniDirective<HTMLDivElement>('tabs-autonav', {
            mounted(el, { value }) {
                const options = JSON.parse(value || '{}');

                module(el, 'tab.auto.nav', () => {
                    const id = el.id;
                    const tabContent = el.querySelector('.tab-content');
                    const navTarget = options.navTarget;
                    const navAttrs = JSON.parse(options.navAttrs || '{}');
                    const fill = options.fill ? 'true' : 'false';

                    if (options.keepactive) {
                        useBs5KeepTab(options.keepactive);
                    }

                    const tabs = tabContent.querySelectorAll('[data-role=tab-pane]');
                    const nav = document.createElement('div');

                    for (const p in navAttrs) {
                        nav.setAttribute(p, navAttrs[p]);
                    }

                    if (!nav.id) {
                        nav.id = id + '-nav'
                    }

                    nav.classList.add('nav', 'nav-' + options.variant);
                    nav.classList.toggle('nav-fill', fill);
                    let hasActive = false;

                    tabs.forEach((tab) => {
                        hasActive = tab.dataset.active || hasActive;
                        const buttonAttrs = JSON.parse(tab.getAttribute('button-attrs'));
                        const item = u.html(`<div class="nav-item">
    <a class="nav-link ${tab.dataset.active ? 'active' : ''}" href="javascript://"
        data-bs-toggle="tab" data-bs-target="#${tab.id}">
        ${tab.dataset.title}
    </a>
</div>
`);

                        for (const p in buttonAttrs) {
                            item.setAttribute(p, buttonAttrs[p]);
                        }

                        nav.appendChild(item);
                    });

                    if (!hasActive) {
                        nav.querySelector('[data-bs-toggle=tab]')?.classList?.add('active');
                        tabContent.querySelector('[data-role=tab-pane]')?.classList?.add('active', 'show');
                    }

                    if (navTarget) {
                        document.querySelector(navTarget)?.appendChild(nav);
                    } else {
                        tabContent.before(nav);
                    }

                    return true;
                });
            }
        });
    </script>
@endpush

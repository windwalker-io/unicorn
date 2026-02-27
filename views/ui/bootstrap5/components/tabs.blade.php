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
?>

<div {!! $attributes !!}>
    <div class="tab-content">
        {!! $slot ?? '' !!}
    </div>
</div>

@push('macro')
    <script data-macro="unicorn.bs5.tabs" lang="ts" type="module">
        import { module, useUniDirective, useBs5KeepTab, html } from '@windwalker-io/unicorn-next';

        useUniDirective('tabs-autonav', {
            mounted(el, { value }) {
                const options = JSON.parse(value || '{}');

                module(el, 'tab.auto.nav', () => {
                    const id = el.id;
                    const tabContent = el.querySelector('.tab-content');
                    const navTarget = options['nav-target'];
                    const navAttrs = options['nav-attrs'] || {};
                    const navClass = options['nav-class'] || '';
                    const fill = options.fill ? true : false;
                    const forceDisabled = options.disabled;

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

                    if (navClass) {
                        nav.classList.add(...navClass.split(' ').filter(i => i !== ''));
                    }

                    if (options.gap) {
                        nav.classList.add('gap-' + options.gap);
                    }

                    let hasActive = false;

                    for (const tab of tabs) {
                        hasActive = tab.dataset.active || hasActive;
                        const buttonAttrs = JSON.parse(tab.getAttribute('button-attrs'));
                        const item = html(`<div class="nav-item">
    <a class="nav-link ${tab.dataset.active ? 'active' : ''}" href="javascript:void(0)"
        data-bs-toggle="tab" data-bs-target="#${tab.id}">
        ${tab.dataset.title}
    </a>
</div>
`);

                        const anchor = item.querySelector('a');

                        for (const p in buttonAttrs) {
                            item.setAttribute(p, buttonAttrs[p]);
                        }

                        if (tab.dataset.disabled === '1' || forceDisabled === true) {
                            anchor.classList.add('disabled');
                            anchor.setAttribute('disabled', 'disabled');
                        }

                        nav.appendChild(item);
                    }

                    if (!hasActive) {
                        nav.querySelector('[data-bs-toggle=tab]')?.classList?.add('active');
                        tabContent.querySelector('[data-role=tab-pane]')?.classList?.add('active', 'show');
                    }

                    if (navTarget) {
                        document.querySelector(navTarget)?.appendChild(nav);
                    } else {
                        tabContent.before(nav);
                    }

                    if (options.options.keepactive) {
                        useBs5KeepTab(options.keepactive);
                    }

                    return true;
                });
            }
        });
    </script>
@endpush

<?php

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

declare(strict_types=1);

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var \Windwalker\Form\Form $form
 * @var string $namespace
 * @var string $size
 * @var string $update
 * @var string $copy
 */

$namespace ??= 'batch';
$id ??= 'batch-modal';
$size ??= 'lg';
$update ??= true;
$copy ??= true;
$updateButtonText ??= $lang('unicorn.core.update');
$copyButtonText ??= $lang('unicorn.core.duplicate');
?>

<div class="modal fade c-batch-modal"
    id="{{ $id }}"
    tabindex="-1" role="dialog"
    aria-labelledby="{{ $id }}-label"
    aria-hidden="true"
    x-title="batch-modal"
    x-data="{ grid: $store.{{ $store ?? 'grid' }} }"
>
    <div class="modal-dialog {{ $size ? 'modal-' . $size : '' }}" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="batch-modal-label">
                    @lang('unicorn.batch.modal.title')
                </h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body c-batch-modal__body">
                <p class="c-batch-modal__desc">
                    @lang('unicorn.batch.modal.desc')
                </p>
                <div class="c-batch-modal__form">
                    @foreach ($form->getFields(null, $namespace) as $field)
                        <x-field :field="$field" class="mb-3"></x-field>
                    @endforeach
                </div>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <div>
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        <span class="fa fa-times"></span>
                        @lang('unicorn.core.close')
                    </button>
                </div>
                <div>
                    @if ($update)
                        <button type="button" class="btn btn-primary ml-2"
                            @click="grid.form.patch()"
                            style="width: 150px"
                        >
                            <i class="fa fa-square-pen"></i>
                            {{ $updateButtonText }}
                        </button>
                    @endif
                    @if ($copy)
                        <button type="button" class="btn btn-outline-primary ml-2"
                            @click="grid.form.post()"
                            style="width: 150px"
                        >
                            <i class="fa fa-clone"></i>
                            {{ $copyButtonText }}
                        </button>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

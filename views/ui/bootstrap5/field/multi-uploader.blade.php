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

$app->service(\Unicorn\Script\FormScript::class)->multiUploader();
$lang = $app->service(LangService::class);

/**
 * @var \Unicorn\Field\MultiUploaderField $field
 * @var \Windwalker\DOM\DOMElement $input
 * @var array $options
 * @var array $data
 * @var \Windwalker\Form\Form $subForm
 */

$hasEditForm = count($subForm);

?>

<multi-uploader id="{{ $field->getId('-wrap') }}" options="{{ json_encode($data) }}">
    <app></app>
</multi-uploader>

@teleport('multi-uploader-field')
<script id="multi-uploader-field-tmpl" type="x-template">
    <vue-drag-uploader
        id="{{ $field->getId() }}"
        :value="value"
        :url="uploadUrl"
        :max-files="maxFiles"
        :thumb-size="thumbSize"
        :disabled="disabled"
        :readonly="readonly"
        accept="{{ $field->getAccept() }}"
        placeholder="{{ $field->getPlaceholder() ?? $lang('unicorn.field.multi.uploader.placeholder') }}"
        @change="value = $event"
        @attr('v-on:item-click', $hasEditForm ? 'itemClick' : 'openFile')
        ref="app"
    >
        <template v-slot:extra="{ item, i }">
            @if ($hasEditForm)
                <h5 v-if="isImage(item.url) && item.title !== ''" class="preview-img__title text-white p-4">
                    @{{ item.title }}
                </h5>
            @endif
            @if (!$field->isDisabled())
                <div class="d-none">
                    @if ($hasEditForm)
                        <input type="hidden" :name="`${fieldFullName}[${i}][url]`" :value="item.url" />
                        @foreach ($subForm->getFields() as $field)
                            <input type="hidden" :name="`${fieldFullName}[${i}][{{ $field->getName() }}]`" :value="item.{{ $field->getName() }}" />
                        @endforeach
                    @else
                        <input type="hidden" :name="`${fieldFullName}[${i}]`" :value="item.url" />
                    @endif
                </div>
            @endif
        </template>
    </vue-drag-uploader>

    @if ($field->isRequired())
    <input type="text" class="form-control"
        style="display: none"
        required :disabled="value.length > 0"
    />
    @endif

    <div v-if="current" class="modal fade" id="{{ $field->getId('-modal') }}" tabindex="-1" role="dialog"
        aria-labelledby="{{ $field->getId('-modal') }}-label" aria-hidden="true"
        ref="modal"
    >
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="-modal-label"></h4>
                    <button type="button" class="close" data-bs-dismiss="modal" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div v-if="isImage(current.url)" class="col-lg-7 text-center">
                            <div class="c-dragarea position-relative"
                                :class="{ 'h-loading': loading }"
                                ref="dragarea"
                                @dragover.stop.prevent="dragover"
                                @dradleave.stop.prevent="dragleave"
                                @drop.stop.prevent="drop"
                            >
                                <div v-if="loading"
                                    class="d-flex align-items-center justify-content-center"
                                    style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; background-color: rgba(255, 255, 255, .5)">
                                    <span class="spinner-border "></span>
                                </div>
                                <a :href="current.url" target="_blank">
                                    <img class="img-fluid rounded" :src="current.url" alt="Img preview">
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-5">
                            @foreach ($subForm->getFields() as $field)
                                <?php
                                $field->addClass(
                                    match (true) {
                                        $field instanceof \Windwalker\Form\Field\CheckboxesField === 'checkbox' => 'form-input-check',
                                        $field instanceof \Windwalker\Form\Field\CheckboxField === 'checkbox' => 'form-input-check',
                                        $field instanceof \Windwalker\Form\Field\ListField === 'select' => 'form-select',
                                        default => 'form-control'
                                    }
                                );
                                ?>
                                <div class="form-group mb-3">
                                    {!! str_replace('value=""', '', $field->render())!!}
                                </div>
                            @endforeach
                            <div class="form-group mt-4">
                                <button type="button" class="btn btn-primary w-100" data-dismiss="modal"
                                    data-bs-dismiss="modal">
                                    @lang('unicorn.field.multi.uploader.meta.button.ok')
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>
@endTeleport

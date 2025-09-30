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

use Unicorn\Field\MultiUploaderField;
use Unicorn\Script\FormScript;
use Unicorn\Script\VueScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\DOM\HTMLElement;
use Windwalker\Form\Form;

$app->service(FormScript::class)->multiUploader();
$lang = $app->service(LangService::class);

/**
 * @var MultiUploaderField $field
 * @var HTMLElement        $input
 * @var array              $options
 * @var Form               $subForm
 */

/** @var $data array{
 *     value: array,
 *     uploadUrl: string,
 *     maxFiles: int,
 *     current: array,
 *     currentIndex: int|null,
 *     thumbSize: int,
 *     disabled: bool,
 *     readonly: bool,
 *     loading: bool,
 *     canReplace: bool,
 *     fieldName: string,
 *     fieldFullName: string
 * }
 */

$hasEditForm = count($subForm);

$tmplId = 'multi-uploader-field-tmpl-' . $field->getId();

$data['tmplSelector'] ??= ('#' . $tmplId);
?>

<uni-multi-uploader id="{{ $field->getId('-wrap') }}" options="{{ json_encode($data) }}">
    <app
        stack-name="{{ $field->getStackName() ?: 'uploading' }}"
    ></app>
</uni-multi-uploader>

@teleport($tmplId)
<script id="{{ $tmplId }}" type="x-template">
    <input id="{{ $field->getId('-empty') }}"
        type="hidden"
        name="{{ $field->getInputName() }}"
        value="{{ $field->get('empty_array_value', '__EMPTY_ARRAY__') }}"
    />

    <MultiUploader
        ref="uploader"
        id="{{ $field->getId() }}"
        upload-url="{{ $data['uploadUrl'] }}"
        v-model="value"
        :options="uploaderOptions"
        @change="onChange"
        @uploading="uploading"
        @uploaded="uploaded"
        @delete-item="domEmit('delete-item', $event)"
        class=""
    >
        <template #items="{ instance, instance: { canUpload, openFileSelector, deleteItem } }">
            <VueDraggable class="d-flex gap-2 flex-wrap w-100"
                v-model="instance.items"
                v-bind="draggableOptions"
                @move="domEmit('reorder', $event)"
            >
            <ItemCard v-for="(item, i) of instance.items"
                :key="item.key"
                class="c-drag-item"
                :item
                :i="i"
                :size="options.thumbSize + 'px'"
                :isReadonly="instance.readonly || instance.disabled"
                @click="{{ $hasEditForm ? 'itemClick(item, i, $event)' : 'openFile(item, i, $event)' }}"
                @delete="deleteItem"
            >
                <template #icon="{ item }">
                  <span :class="fileIcon(item)" style="font-size: 2.5rem"></span>
                </template>

                <template v-slot:extra="{ item }">
                @if ($hasEditForm)
                        <h5 v-if="isImage(item.url) && item.data.title !== ''" class="preview-img__title text-white p-4">
                        @{{ item.data.title }}
                    </h5>
                    @endif
                    @if (!$field->isDisabled())
                        <div class="d-none">
                        @if ($hasEditForm)
                                <input type="hidden" :name="`{{ $field->getInputName() }}[${i}][url]`"
                                    :value="item.url" />
                                @foreach ($subForm->getFields() as $subField)
                                    <input type="hidden"
                                        :name="`{{ $field->getInputName() }}[${i}][{{ $subField->getName() }}]`"
                                        :value="item.data?.{{ $subField->getName() }}" />
                                @endforeach
                            @else
                                <input type="hidden" :name="`{{ $field->getInputName() }}[${i}]`" :value="item.url" />
                            @endif
                    </div>
                    @endif
                </template>
            </ItemCard>

            <ItemCardPlaceholder
                v-if="canUpload"
                class=""
                :size="options.thumbSize + 'px'"
                text="{{ $field->getPlaceholder() ?? $lang('unicorn.field.multi.uploader.placeholder') }}"
                @click="openFileSelector"
            >
                <template #icon>
                  <span class="fa-solid fa-cloud-arrow-up" style="font-size: 2rem"></span>
                </template>
            </ItemCardPlaceholder>
            </VueDraggable>
        </template>
    </MultiUploader>

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
                    <h4 class="modal-title" id="{{ $field->getId('-modal-label') }}"></h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" data-dismiss="modal"
                        aria-label="Close"></button>
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

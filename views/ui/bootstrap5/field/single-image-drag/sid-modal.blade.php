@teleport('uni.sid:' . $field->getId())
<div class="modal fade c-sid-modal" id="{{ $field->getId('__modal') }}" tabindex="-1" role="dialog"
    data-sid="modal"
    aria-labelledby="{{ $field->getId('__modal-label') }}">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="{{ $field->getId('__modal-label') }}">
                    @lang('unicorn.field.sid.crop')
                </h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="c-sid-modal__loading">
                    <span class="spinner-grow"></span>
                </div>
                <div class="c-sid-modal__content">
                    <div class="c-sid-modal__img-container" data-sid="crop-container" style="height: 400px; visibility: hidden">
                        <img id="image" src="" alt="Picture" data-sid="cropper" style="height: 400px; visibility: hidden">
                    </div>

                    <div class="mt-3 d-flex justify-content-between align-items-center w-100">
                        <div>
                            <span class="fa fa-fw fa-search-plus"></span>
                            Scroll to zoom in/out
                        </div>
                        <div class="">
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="zoom-out">
                                <span class="fa fa-fw fa-search-minus"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="zoom-in">
                                <span class="fa fa-fw fa-search-plus"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="rotate-left">
                                <span class="fa fa-fw fa-undo"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="rotate-right">
                                <span class="fa fa-fw fa-redo"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="scale-x">
                                <span class="fa fa-fw fa-arrows-alt-h"></span>
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                data-sid-toolbar="scale-y">
                                <span class="fa fa-fw fa-arrows-alt-v"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fa fa-times"></i>
                    @lang('unicorn.field.sid.close')
                </button>
                <button type="button" class="btn btn-primary"
                    data-sid="save-button"
                    style="width: 150px"
                >
                    <i class="fa fa-check"></i>
                    @lang('unicorn.field.sid.ok')
                </button>
            </div>
        </div>
    </div>
</div>
@endTeleport

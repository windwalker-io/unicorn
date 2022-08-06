{{-- Part of earth project. --}}
<?php

/**
 * @var \Windwalker\Form\Form $form
 */

$titleField = $titleField ?? 'title';
$aliasField = $aliasField ?? 'alias';

$field = $form->getField($titleField);

$end ??= \Windwalker\nope();
$slot ??= \Windwalker\nope();
$before ??= \Windwalker\nope();
$after ??= \Windwalker\nope();
?>
<div class="title-bar row form-horizontal">
    <div class="col-md-8">
        {!! $before() ?? '' !!}

        @if ($title = $form->getField($titleField))
             <x-field :field="$title" class="mb-3" input-class="input-lg form-control-lg"
                 floating
             ></x-field>
        @endif

        @if ($alias = $form->getField($aliasField))
            <x-field :field="$alias" class="mb-3" input-class="input-sm form-control-sm"
                floating
            ></x-field>
        @endif

        {!! $after() ?? '' !!}

        {!! $slot(field: $field) !!}
    </div>
    @if ($end ?? null)
        <div class="col">
            {!! $end() !!}
        </div>
    @endif
</div>

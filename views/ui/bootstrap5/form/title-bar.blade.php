{{-- Part of earth project. --}}
<?php

/**
 * @var \Windwalker\Form\Form $form
 */

$ns ??= '';
$end ??= \Windwalker\nope();
$slot ??= \Windwalker\nope();
$before ??= \Windwalker\nope();
$after ??= \Windwalker\nope();
$star ??= false;

$titleField = $titleField ?? trim($ns . '/title', '/');
$aliasField = $aliasField ?? trim($ns . '/alias', '/');

$titleInput = $form->getField($titleField);
$aliasInput = $form->getField($aliasField);
?>
<div class="l-title-bar row">
    <div class="col-md-8">
        {!! $before() ?? '' !!}

        @if ($titleInput)
             <x-field :field="$titleInput" class="mb-3" input-class="input-lg form-control-lg"
                 floating :star="$star"
             ></x-field>
        @endif

        @if ($aliasInput)
            <x-field :field="$aliasInput" class="mb-3" input-class="input-sm form-control-sm"
                floating :star="$star"
            ></x-field>
        @endif

        {!! $after() ?? '' !!}

        {!! $slot(field: $titleInput, form: $form) !!}
    </div>
    @if ($end ?? null)
        <div class="col">
            {!! $end() !!}
        </div>
    @endif
</div>

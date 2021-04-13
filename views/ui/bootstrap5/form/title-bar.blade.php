{{-- Part of earth project. --}}
<?php
$titleField = $titleField ?? 'title';
$aliasField = $aliasField ?? 'alias';

$field = $form->getField($titleField);
?>
<div class="title-bar row form-horizontal">
    <div class="col-md-8">
        @if ($form->getField($titleField))
            {!! $form->getField($titleField)->appendAttribute('class', ' input-lg form-control-lg')->render() !!}
        @endif

        @if ($form->getField($aliasField))
            {!! $form->getField($aliasField)->set('fieldWidth', 'col-md-5')->appendAttribute('class', ' input-sm form-control-sm')->render() !!}
        @endif

        {!! $end(field: $field) ?? '' !!}

        {!! $slot(field: $field) !!}
    </div>
</div>

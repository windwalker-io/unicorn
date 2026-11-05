<?php

declare(strict_types=1);

use Windwalker\Core\Pagination\Pagination;

/**
 * @var $pagination Pagination
 */

$result = $pagination->compile();
?>

@if ($pagination->getPages() > 1 || $pagination->isSimple())
<nav aria-label="navigation" class="l-pagination">
    <ul class="pagination c-pagination">
        @foreach ($result->getPages() as $page)
            <li class="page-item page-item--{{ $page->page }}{{ $page->name === Pagination::CURRENT ? ' active' : '' }}">
                <a class="page-link" href="{{ $page }}">{{ $page->page }}</a>
            </li>
        @endforeach
    </ul>
</nav>

@include('components.pagination-jump', ['pagination' => $pagination])
@endif

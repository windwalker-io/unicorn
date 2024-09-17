<?php

declare(strict_types=1);

namespace App\view;

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

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $pagination Pagination
 */
?>
<div class="l-pagination-stats ms-0 ms-md-auto">
    <div class="pagination">
        <div class="page-item disabled">
            <div class="page-link">
                總數 <strong>{{ $pagination->getTotal() }}</strong>
            </div>
        </div>

        <div class="page-item disabled">
            <div class="page-link">
                每頁 <strong>{{ $pagination->getLimit() }}</strong> 筆
            </div>
        </div>

        <div class="page-item disabled">
            <div class="page-link">
                共 <strong>{{ $pagination->getPages() }}</strong> 頁
            </div>
        </div>
    </div>
</div>

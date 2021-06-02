<?php
/**
 * Part of phoenix project.
 *
 * @copyright  Copyright (C) 2016 LYRASOFT. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

namespace Unicorn\Legacy\Html\State;

use Unicorn\Html\State\StateButton;

/**
 * The BooleanButton class.
 *
 * @since  1.1
 */
class PublishedButton extends StateButton
{
    /**
     * configure
     *
     * @return  void
     */
    protected function init(): void
    {
        $this->addState('0', 'publish', 'fa fa-fw fa-remove fa-times text-danger')
            ->addState('1', 'unpublish', 'fa fa-fw fa-check text-success');
    }
}

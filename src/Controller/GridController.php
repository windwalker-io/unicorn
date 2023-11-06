<?php

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Repository\ListRepositoryInterface;
use Unicorn\Repository\ManageRepositoryInterface;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Event\CoreEventAwareTrait;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Event\EventAwareInterface;
use Windwalker\Event\EventAwareTrait;
use Windwalker\Session\Session;

use function Windwalker\value;

/**
 * The GridController class.
 */
class GridController implements EventAwareInterface
{
    use CoreEventAwareTrait;

    protected bool $muted = false;

    /**
     * GridController constructor.
     */
    public function __construct(protected LangService $lang)
    {
        $this->lang = $this->lang->extract('unicorn.message.batch.');
    }

    public function filter(Navigator $nav, ListRepositoryInterface $repository, Session $session): RouteUri
    {
        $state = $repository->getState();

        $state->rememberFromRequest('filter');
        $state->rememberFromRequest('search');
        $state->rememberFromRequest('limit');
        $state->rememberFromRequest('list_ordering');
        $state->forget('page');

        return $nav->self();
    }

    public function batch(AppContext $app, ManageRepositoryInterface $repository, mixed $data = null): mixed
    {
        if ($task = $app->input('task')) {
            $method = 'batch' . ucfirst($task);

            if (is_callable([$this, $method])) {
                return $app->call([$this, $method], compact('repository'));
            }
        }

        return $app->call([$this, 'batchUpdate'], compact('repository', 'data'));
    }

    public function batchUpdate(
        AppContext $app,
        Navigator $nav,
        ManageRepositoryInterface $repository,
        mixed $data = null
    ): RouteUri {
        $ids = (array) $app->input('id');
        $data ??= (array) $app->input('batch');
        $data = value($data);

        $action = $repository->createBatchAction();

        $action->addEventDealer($this);

        $action->update($ids, $data);

        if (!$this->isMuted()) {
            $task = $app->input('task');

            $app->addMessage(
                $task && $this->lang->has("$task.success")
                    ? $this->lang->trans("$task.success", count($ids))
                    : $this->lang->trans('update.success', count($ids)),
                'success'
            );
        }

        return $nav->back();
    }

    public function copy(AppContext $app, Navigator $nav, ManageRepositoryInterface $repository): RouteUri
    {
        $ids = (array) $app->input('id');
        $data = (array) $app->input('batch');

        $action = $repository->createBatchAction();

        $action->addEventDealer($this);

        $action->copy($ids, $data);

        if (!$this->isMuted()) {
            $app->addMessage($this->lang->trans('copy.success', count($ids)), 'success');
        }

        return $nav->back();
    }

    public function batchMove(AppContext $app, Navigator $nav, ManageRepositoryInterface $repository): RouteUri
    {
        $ids = (array) $app->input('id');

        $repository->createReorderAction()->move($ids, (int) $app->input('delta'));

        if (!$this->isMuted()) {
            $app->addMessage($this->lang->trans('reorder.success'), 'success');
        }

        return $nav->back();
    }

    public function batchReorder(AppContext $app, Navigator $nav, ManageRepositoryInterface $repository): RouteUri
    {
        $orders = (array) $app->input('ordering');

        $repository->createReorderAction()->reorder($orders);

        if (!$this->isMuted()) {
            $app->addMessage($this->lang->trans('reorder.success'), 'success');
        }

        return $nav->back();
    }

    /**
     * @return bool
     */
    public function isMuted(): bool
    {
        return $this->muted;
    }

    /**
     * @param  bool  $muted
     *
     * @return  static  Return self to support chaining.
     */
    public function setMuted(bool $muted): static
    {
        $this->muted = $muted;

        return $this;
    }
}

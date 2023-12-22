<?php

declare(strict_types=1);

namespace Unicorn\Controller;

use Unicorn\Repository\CrudRepositoryInterface;
use Unicorn\Repository\Event\PrepareSaveEvent;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Event\CoreEventAwareTrait;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Core\View\View;
use Windwalker\Event\EventAwareInterface;
use Windwalker\ORM\Event\AfterDeleteEvent;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\Event\BeforeDeleteEvent;
use Windwalker\ORM\Event\BeforeSaveEvent;
use Windwalker\ORM\NestedSetMapper;

/**
 * The CrudController class.
 */
class CrudController implements EventAwareInterface
{
    use CoreEventAwareTrait;

    protected ?string $formNamespace = 'item';

    protected bool $muted = false;

    /**
     * CrudController constructor.
     */
    public function __construct(protected LangService $lang)
    {
        $this->lang = $this->lang->extract('unicorn.message.');
    }

    public function index(string $view, AppContext $app): mixed
    {
        /** @var View $vm */
        $vm = $app->make($view);

        return $vm->render();
    }

    public function save(
        AppContext $app,
        Navigator $nav,
        CrudRepositoryInterface $repository,
        mixed $form,
        array $formArgs = [],
        ?array $data = null,
        int $options = 0
    ): RouteUri {
        try {
            $ns = $this->getFormNamespace();

            $data ??= $app->input($ns);

            $action = $repository->createSaveAction();

            $action->addEventDealer($this);

            $form = $action->getForm($form);

            // 4.0 BC
            if ($form->getNamespace() !== $ns) {
                $data = [$ns => $data];
            }

            $data = $action->processDataAndValidate($data, $form, $formArgs, $options);

            // 4.0 BC
            if ($form->getNamespace() !== $ns) {
                $item = $data[$ns] ?? [];
            }

            $item = $action->save($item);

            if (!$this->isMuted()) {
                $app->addMessage(
                    $this->lang->trans('save.success'),
                    'success'
                );
            }

            return $nav->self()->id($item->getId());
        } catch (\RuntimeException $e) {
            $item = $app->input($this->getFormNamespace());
            $repository->getState()->remember('edit.data', $item);

            throw $e;
        }
    }

    public function rememberForClone(AppContext $app, CrudRepositoryInterface $repository): void
    {
        $item = $app->input($this->getFormNamespace());
        $mk = $repository->getEntityMapper()->getMainKey();

        if ($mk) {
            unset($item[$mk]);
        }

        $repository->getState()->remember('edit.data', $item);
    }

    public function delete(
        AppContext $app,
        Navigator $nav,
        CrudRepositoryInterface $repository,
        mixed $id = null,
    ): RouteUri {
        $ids = (array) ($id ?? $app->input('id'));

        if ($ids === []) {
            return $nav->back();
        }

        /** @var NestedSetMapper $mapper */
        $mapper = $repository->getEntityMapper();
        $key    = $mapper->getMainKey() ?? 'id';

        $mapper->getORM()->addEventDealer($this);

        $repository->getDb()->transaction(fn() => $repository->delete([$key => $ids]));

        if (!$this->isMuted()) {
            $app->addMessage(
                $this->lang->trans("batch.delete.success", count($ids)),
                'success'
            );
        }

        return $nav->back();
    }

    public function prepareSave(callable $handler): static
    {
        $this->on(PrepareSaveEvent::class, $handler);

        return $this;
    }

    public function beforeSave(callable $handler): static
    {
        $this->on(BeforeSaveEvent::class, $handler);

        return $this;
    }

    public function afterSave(callable $handler): static
    {
        $this->on(AfterSaveEvent::class, $handler);

        return $this;
    }

    public function beforeDelete(callable $handler): static
    {
        $this->on(BeforeDeleteEvent::class, $handler);

        return $this;
    }

    public function afterDelete(callable $handler): static
    {
        $this->on(AfterDeleteEvent::class, $handler);

        return $this;
    }

    /**
     * @return string|null
     */
    public function getFormNamespace(): ?string
    {
        return $this->formNamespace;
    }

    /**
     * @param  string|null  $formNamespace
     *
     * @return  static  Return self to support chaining.
     */
    public function setFormNamespace(?string $formNamespace): static
    {
        $this->formNamespace = $formNamespace;

        return $this;
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

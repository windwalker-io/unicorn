<?php

declare(strict_types=1);

namespace Unicorn\Repository\Actions;

use Windwalker\Core\Form\Exception\ValidateFailException;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Service\FilterService;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Filter\Exception\ValidateException;
use Windwalker\Form\Form;
use Windwalker\Form\ValidateResult;
use Windwalker\Utilities\Arr;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

use function Windwalker\collect;

/**
 * Trait FormAwareActionTrait
 */
trait FormAwareActionTrait
{
    use InstanceCacheTrait;
    use TranslatorTrait;

    #[Inject]
    protected FormFactory $formFactory;

    #[Inject]
    protected FilterService $filterService;

    /**
     * filterBy
     *
     * @param  array  $data
     * @param  mixed  $form
     * @param  array  $args
     *
     * @return  array
     */
    public function filterBy(
        array $data,
        mixed $form,
        array $args = [],
        bool $keepFullData = false
    ): array {
        if (is_array($form)) {
            if (array_is_list($form)) {
                return Arr::except($data, $form);
            }

            return $this->filterService->filter($data, $form);
        }

        $form = $this->getForm($form, $args);

        if ($form instanceof Form) {
            return $form->filter($data, $keepFullData);
        }

        return $data;
    }

    /**
     * validateBy
     *
     * @param  array  $data
     * @param  mixed  $form
     * @param  array  $args
     *
     * @return  bool
     */
    public function validateBy(array $data, mixed $form, array $args = []): bool
    {
        if (is_array($form)) {
            try {
                return $this->filterService->validate($data, $form);
            } catch (ValidateException $e) {
                throw new ValidateFailException($e->getMessage());
            }
        }

        $form = $this->getForm($form, $args);

        if ($form instanceof Form) {
            $resultSet = $form->validate($data);

            if ($resultSet->isFailure()) {
                $messages = collect($resultSet->getResults())
                    ->filter(fn (ValidateResult $result) => $result->isFailure())
                    ->map(function (ValidateResult $result) {
                        $field = $result->getField();
                        $name = $field->getName();

                        if ($field->getLabelName()) {
                            $name .= " ({$field->getLabelName()})";
                        }

                        return $this->trans('unicorn.message.validation.failure', $name);
                    });

                if (count($messages)) {
                    throw new ValidateFailException($messages->dump());
                }
            }

            return true;
        }

        return true;
    }

    /**
     * getForm
     *
     * @param  object|string|null  $form
     * @param  array               $args
     *
     * @return  Form
     */
    public function getForm(
        object|string|null $form = null,
        array $args = []
    ): Form {
        if ($form instanceof Form) {
            return $form;
        }

        $id = $form;

        if (is_object($id)) {
            $id = $id::class;
        }

        $id = 'form: ' . ($id ?? 'default');

        return $this->cacheStorage[$id] ??= $this->formFactory->create($form, ...$args);
    }
}

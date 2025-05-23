<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Unicorn\Field\DatabaseAwareTrait;
use Unicorn\Field\LayoutFieldTrait;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\HTMLElement;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Query\Query;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

use function Windwalker\raw;

/**
 * The BoxSelectorField class.
 *
 * @method $this source(mixed $value)
 * @method mixed getSource()
 * @method $this modalTitle(string $value)
 * @method string getModalTitle()
 * @method $this branchSelectable(bool $value)
 * @method bool isBranchSelectable()
 * @method $this valueField(string $value)
 * @method string getValueField()
 * @method $this titleField(string $value)
 * @method string getTitleField()
 * @method $this multiple(bool $value)
 * @method bool isMultiple()
 * @method $this vertical(bool $value)
 * @method bool isVertical()
 * @method $this itemClass(string $value)
 * @method string getItemClass()
 * @method $this buttonText(string $value)
 * @method string getButtonText()
 * @method $this searchText(string $value)
 * @method string getSearchText()
 */
class ModalTreeField extends AbstractField
{
    use InstanceCacheTrait;
    use LayoutFieldTrait;
    use DatabaseAwareTrait;
    use TranslatorTrait;

    #[Inject]
    protected UnicornScript $unicornScript;

    public function prepareInput(HTMLElement $input): HTMLElement
    {
        return $input;
    }

    public function getDefaultLayout(): string
    {
        return '@theme::field.modal-tree';
    }

    public function buildFieldElement(HTMLElement $input, array $options = []): string|HTMLElement
    {
        $key = 'field.modal-tree:' . $this->getId();

        $input['source'] = $this->getSource();
        $input['modal-title'] = $this->getModalTitle();
        $input[':branch-selectable'] = $this->isBranchSelectable() ? 'true' : null;
        $input['name'] .= '[]';
        $input[':value'] = json_encode($this->getSelectedIds());
        $input['button-text'] = $this->getButtonText()
            ?: $this->trans('unicorn.field.modal.tree.button.select');
        $input['placeholder'] = $this->getButtonText()
            ?: $this->trans('unicorn.field.modal.tree.placeholder');
        $input['search-text'] = $this->getSearchText()
            ?: $this->trans('unicorn.field.modal.tree.search');
        $input[':vertical'] = $this->isVertical() ? 'true' : 'false';

        if ($this->isMultiple()) {
            $input[':multiple'] = 'true';
        }

        if ($this->getItemClass()) {
            $input['item-class'] = $this->getItemClass();
        }

        // $input['value-key'] = $key;
        $input[':items'] = raw(
            "function () { return \$u.data('$key'); }"
        );

        $input->removeAttribute('value');
        $input->removeClass('form-control');

        $this->unicornScript->data($key, $this->getSelectedItems());

        return $this->renderLayout(
            $this->getLayout(),
            [
                'field' => $this,
                'input' => $input,
                'options' => $options
            ]
        );
    }

    public function getSelectedItems(): array
    {
        return $this->compileQuery()->all()->dump();
    }

    protected function getSelectedIds(): mixed
    {
        $value = $this->cacheStorage['value'] ?? $this->getValue() ?: [];

        if ($this->isMultiple()) {
            return (array) $value;
        }

        return $value;
    }

    protected function prepareQuery(Query $query): void
    {
        $query->where($this->getValueField() ?? 'id', 'in', (array) $this->getSelectedIds() ?: [0]);
    }

    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'source',
                'modalTitle',
                'branchSelectable',
                'valueField',
                'titleField',
                'multiple',
            ]
        );
    }
}

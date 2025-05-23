<?php

declare(strict_types=1);

namespace Unicorn\Field;

use Unicorn\Script\FormScript;
use Unicorn\Script\VueScript;
use Windwalker\Core\Asset\AssetService;
use Windwalker\DI\Attributes\Service;
use Windwalker\DOM\HTMLElement;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Utilities\StrNormalize;

use function Windwalker\DOM\h;
use function Windwalker\raw;

/**
 * The VueComponentField class.
 */
class VueComponentField extends AbstractField
{
    #[Service]
    protected FormScript $formScript;

    #[Service]
    protected VueScript $vueScript;

    protected string $componentName = 'component';

    protected ?string $initFunction = null;

    protected \Closure|HTMLElement|string|null $storeElement = null;

    protected ?\Closure $slots = null;

    protected bool $json = false;

    public function prepareInput(HTMLElement $input): HTMLElement
    {
        return $input;
    }

    public function buildFieldElement(HTMLElement $input, array $options = []): string|HTMLElement
    {
        $this->formScript->vueComponentField(
            '#' . $this->getId('-wrapper') . ' [data-vue-app]',
            $this->getValue(),
            [
                'json' => $this->isJson(),
                'init' => $this->initFunction ? raw($this->initFunction) : null,
            ]
        );

        if ($this->storeElement) {
            if ($this->storeElement instanceof \Closure) {
                $store = ($this->storeElement)($this, $input, $options);
            } else {
                $store = $this->storeElement;
            }
        } else {
            $store = h('input');
            $store->setAttribute('id', $this->getId());
            $store->setAttribute('name', $this->getInputName());
            $store->setAttribute(':value', 'value');
            $store->setAttribute('type', 'text');
            $store->setAttribute('data-field-input', '');
            $store->setAttribute('ref', 'storeInput');
            $store->setAttribute('required', $this->isRequired());
            $store->setAttribute('disabled', $this->isDisabled());
            $store->setAttribute('readonly', $this->isReadonly());
        }

        $input->removeAttribute('id');
        $input->removeAttribute('name');
        $input->removeAttribute('data-field-input');

        $input->setAttribute('data-vue-component', '');
        $input->setAttribute('ref', 'mainInput');
        $input->setAttribute('v-model', 'value');
        $input->setAttribute('v-on:change', 'onChange');
        $input->setAttribute('v-on:input', 'onInput');
        $input->setAttribute('v-on:invalid', 'onInvalid');

        $input->setAttribute('required', $this->isRequired());
        $input->setAttribute('disabled', $this->isDisabled());
        $input->setAttribute('readonly', $this->isReadonly());

        $slots = $this->slots ? ($this->slots)($this, $input, $options) : null;

        return h(
            'div',
            ['data-vue-field' => true],
            [
                h(
                    'div',
                    ['data-vue-app' => true],
                    [
                        h('div', ['data-el-placeholder' => '', 'ref' => 'elPlaceholder']),
                        h(
                            StrNormalize::toKebabCase($this->componentName),
                            $input->getAttributes(true),
                            $slots,
                        )
                    ]
                ),
                h(
                    'div',
                    ['style' => 'display: none'],
                    $store
                ),
            ]
        );
    }

    /**
     * @return string
     */
    public function getComponentName(): string
    {
        return $this->componentName;
    }

    /**
     * @param  string  $componentName
     *
     * @return  static  Return self to support chaining.
     */
    public function componentName(string $componentName): static
    {
        $this->componentName = $componentName;

        return $this;
    }

    public function bind(string $name, mixed $value): static
    {
        $this->setAttribute(':' . $name, AssetService::getJSObject($value));

        return $this;
    }

    public function on(string $eventName, mixed $expression): static
    {
        $this->setAttribute('v-on:' . $eventName, $expression);

        return $this;
    }

    public function directive(string $name, mixed $expression): static
    {
        $this->setAttribute($name, $expression);

        return $this;
    }

    /**
     * @return string|null
     */
    public function getInitFunction(): ?string
    {
        return $this->initFunction;
    }

    /**
     * @param  string|null  $initFunction
     *
     * @return  static  Return self to support chaining.
     */
    public function initFunction(?string $initFunction): static
    {
        $this->initFunction = $initFunction;

        return $this;
    }

    /**
     * @return bool
     */
    public function isJson(): bool
    {
        return $this->json;
    }

    /**
     * @param  bool  $json
     *
     * @return  static  Return self to support chaining.
     */
    public function useJson(bool $json): static
    {
        $this->json = $json;

        return $this;
    }

    /**
     * @return \Closure|null
     */
    public function getSlots(): ?\Closure
    {
        return $this->slots;
    }

    /**
     * @param  \Closure|null  $slots
     *
     * @return  static  Return self to support chaining.
     */
    public function slots(?\Closure $slots): static
    {
        $this->slots = $slots;

        return $this;
    }

    public function assetJS(string $url, array $options = [], array $attrs = []): static
    {
        $this->vueScript->vue();

        $this->formScript->js($url, $options, $attrs);

        return $this;
    }

    public function assetCSS(string $url, array $options = [], array $attrs = []): static
    {
        $this->formScript->css($url, $options, $attrs);

        return $this;
    }
}

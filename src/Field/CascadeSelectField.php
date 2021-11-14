<?php

/**
 * Part of datavideo project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Lyrasoft\Luna\Tree\Node;
use Unicorn\Field\LayoutFieldTrait;
use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Utilities\Arr;
use Windwalker\Utilities\Assert\TypeAssert;
use Windwalker\Utilities\Cache\InstanceCacheTrait;
use Windwalker\Utilities\Wrapper\RawWrapper;

/**
 * The AbstractCascadeSelectField class.
 *
 * @method $this placeholder(mixed $value)
 * @method mixed getPlaceholder()
 * @method $this ajaxUrl(mixed $url)
 * @method mixed getAjaxUrl()
 * @method $this ajaxValueField(string $value)
 * @method mixed getAjaxValueField()
 * @method $this labels(array $value)
 * @method mixed getLabels()
 * @method $this labelWidth(string $value)
 * @method mixed getLabelWidth()
 * @method $this fieldWidth(string $value)
 * @method mixed getFieldWidth()
 * @method $this horizontal(bool $value)
 * @method mixed getHorizontal()
 * @method $this horizontalColWidth(mixed $value)
 * @method mixed getHorizontalColWidth()
 * @method $this source(mixed $value)
 * @method mixed getSource()
 * @method $this cascadeSelectOptions(array $value)
 * @method mixed getCascadeSelectOptions()
 */
class CascadeSelectField extends AbstractField
{
    use LayoutFieldTrait;
    use InstanceCacheTrait;

    /**
     * @var callable
     */
    protected $pathHandler;

    protected mixed $ignoreSelf = false;

    protected string $valueField = 'id';

    protected string $textField = 'title';

    protected array $placeholders = [];

    public function getDefaultLayout(): string
    {
        return '@theme::field.cascade-select';
    }

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        $value = $this->getValue();

        if (!is_array($value)) {
            $path = $this->getPathHandler()($value, $this);

            TypeAssert::assert(
                is_array($path),
                'The path handler should return array, got {value}.',
                $path
            );
        } else {
            $path = $value;
        }

        $selected = $path[array_key_last($path)] ?? null;

        return $this->renderLayout(
            $this->getLayout(),
            [
                'input' => $input,
                'field' => $this,
                'options' => $options,
                'path' => $path,
                'selected' => $selected
            ]
        );
    }

    public function prepareInput(DOMElement $input): DOMElement
    {
        $input['type']      = 'text';
        $input['value']     = $this->escape($this->getValue());
        $input['style']     = 'display: none;';
        $input['data-role'] = 'value';

        return $input;
    }

    /**
     * @return array
     */
    public function getPlaceholders(): array
    {
        return $this->placeholders;
    }

    /**
     * @param  array  $placeholders
     *
     * @return  static  Return self to support chaining.
     */
    public function placeholders(array $placeholders): static
    {
        $this->placeholders = $placeholders;

        return $this;
    }

    protected function getValuePath(mixed $value): array
    {
        if ($this->getAjaxUrl()) {
            throw new \LogicException('Please set pathHandler to get value path');
        }

        $source = $this->getSource();

        if ($source instanceof Node) {
            /** @var Node $node */
            foreach ($source->iterate() as $node) {
                $v = $node->getValue();
                $v = Arr::get($v, $this->getValueField());

                if ((string) $v === (string) $value) {
                    $result = [];
                    $segments = $node->getAncestorsAndSelf();
                    array_shift($segments);

                    foreach ($segments as $segment) {
                        $sv = $segment->getValue();
                        $result[] = Arr::get($sv, $this->getValueField());
                    }

                    return $result;
                }
            }
        }

        return [];
    }

    public function getSourceValues(): mixed
    {
        $source = $this->getSource();

        if ($source instanceof Node) {
            return json_decode(json_encode($source), true)['children'] ?? [];
        }

        return $source;
    }

    /**
     * @return callable
     */
    public function getPathHandler(): callable
    {
        return $this->pathHandler ?? [$this, 'getValuePath'];
    }

    /**
     * @param  callable  $pathHandler
     *
     * @return  static  Return self to support chaining.
     */
    public function pathHandler(callable $pathHandler): static
    {
        $this->pathHandler = $pathHandler;

        return $this;
    }

    /**
     * @return bool|mixed
     */
    public function getIgnoreSelfValue(): mixed
    {
        return $this->ignoreSelf;
    }

    /**
     * @param  bool|mixed  $ignoreSelf
     *
     * @return  static  Return self to support chaining.
     */
    public function ignoreSelfWith(mixed $ignoreSelf): static
    {
        $this->ignoreSelf = $ignoreSelf;

        return $this;
    }

    /**
     * @return string
     */
    public function getValueField(): string
    {
        return $this->valueField;
    }

    /**
     * @param  string  $valueField
     *
     * @return  static  Return self to support chaining.
     */
    public function valueField(string $valueField): static
    {
        $this->valueField = $valueField;

        return $this;
    }

    /**
     * @return string
     */
    public function getTextField(): string
    {
        return $this->textField;
    }

    /**
     * @param  string  $textField
     *
     * @return  static  Return self to support chaining.
     */
    public function textField(string $textField): static
    {
        $this->textField = $textField;

        return $this;
    }

    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'ajaxUrl',
                'ajaxValueField',
                'horizontal',
                'horizontalColWidth',
                'labels',
                'labelWidth',
                'fieldWidth',
                'source',
                'cascadeSelectOptions'
            ]
        );
    }
}

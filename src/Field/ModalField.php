<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Psr\Http\Message\UriInterface;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\DOMElement;
use Windwalker\Form\Field\AbstractField;
use Windwalker\Query\Query;
use Windwalker\Utilities\Arr;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

/**
 * The ModalField class.
 *
 * @method  $this  callback(string $value = null)
 * @method  $this  titleClass(string $value = null)
 * @method  mixed  getTitleClass()
 * @method  $this  buttonText(string $value = null)
 * @method  mixed  getButtonText()
 * @method  $this  multiple(bool $value = null)
 * @method  mixed  isMultiple()
 * @method  $this  itemTemplate(mixed $value = null)
 * @method  mixed  getItemTemplate()
 * @method  $this  hasImage(bool $value = null)
 * @method  mixed  isHasImage()
 * @method  $this  sortable(bool $value = null)
 * @method  mixed  isSortable()
 * @method  $this  placeholder(string $value = null)
 * @method  mixed  getPlaceholder()
 * @method  $this  height(int $value = null)
 * @method  mixed  getHeight()
 * @method  $this  max(int $value = null)
 * @method  mixed  getMax()
 */
class ModalField extends AbstractField
{
    use LayoutFieldTrait;
    use InstanceCacheTrait;
    use DatabaseAwareTrait;

    /**
     * Property titleField.
     *
     * @var  string
     */
    protected string $titleField = 'title';

    /**
     * Property keyName.
     *
     * @var  string
     */
    protected string $keyField = 'id';

    /**
     * Property imageField.
     *
     * @var  string
     */
    protected string $imageField = 'image';

    /**
     * Property route.
     *
     * @var  string|UriInterface
     */
    protected string|null|UriInterface $url = null;

    protected string|RouteUri|null $route = null;

    #[Inject]
    protected Navigator $nav;

    #[Inject]
    protected LangService $lang;

    #[Inject]
    protected UnicornScript $unicornScript;

    public function prepareInput(DOMElement $input): DOMElement
    {
        $input['type']      = 'text';
        $input['value']     = $this->escape($this->getValue());
        $input['style']     = 'display: none;';
        $input['data-role'] = 'value';

        return $input;
    }

    public function buildFieldElement(DOMElement $input, array $options = []): string|DOMElement
    {
        $multiple = (bool) $this->isMultiple();
        $title    = '';
        $image    = '';
        $items    = [];

        if ($multiple) {
            // This is for tag type
            // if ($listType === static::TYPE_TAG) {
            //     $input->tagName = 'select';
            //     $input->setAttribute('multiple', true);
            //     $input['name'] .= '[]';
            //
            //     $input->removeAttribute('type');
            //     $input->removeAttribute('value');
            //
            //     $items   = $this->getItems();
            //     $options = [];
            //
            //     foreach ($items as $item) {
            //         $options[] = DOMElement::create(
            //             'option',
            //             $item['title'],
            //             [
            //                 'value' => $item['title'],
            //                 'selected' => 'selected',
            //             ]
            //         );
            //     }
            //
            //     $input->append(...$options);
            // }
            $this->unicornScript->data(
                'unicorn.modal-field',
                [
                    $this->getId() => $this->getItems()
                ]
            );

            if ($this->isSortable()) {
                $this->unicornScript->importScript('@sortablejs');
            }
        } else {
            $title = $this->getItemTitle();

            if ($this->isHasImage()) {
                $image = $this->getItemImage();
            }
        }

        $url        = $this->getUrl();
        $field      = $this;
        $buttonText = $field->getButtonText() ?? $this->lang->trans('unicorn.field.modal.button.text');

        return $this->renderLayout(
            $this->getLayout(),
            compact(
                'title',
                'image',
                'input',
                'url',
                'field',
                'items',
                'buttonText'
            )
        );
    }

    public function getDefaultLayout(): string
    {
        if ($this->isMultiple()) {
            return '@theme::field.modal.modal-list';
        }

        return '@theme::field.modal.modal-single';
    }

    protected function getItemTitle(): ?string
    {
        $titleField = $this->getTitleField();

        return $this->getItem()[$titleField] ?? null;
    }

    /**
     * getImage
     *
     * @return  string
     *
     * @throws \Psr\Cache\InvalidArgumentException
     *
     * @since  1.7.3
     */
    protected function getItemImage(): ?string
    {
        $imageField = $this->getImageField();

        return $this->getItem()[$imageField];
    }

    /**
     * @return string|RouteUri|null
     */
    public function getRoute(): string|RouteUri|null
    {
        return $this->route;
    }

    /**
     * @param  string|RouteUri|null  $route
     *
     * @return  static  Return self to support chaining.
     */
    public function route(string|RouteUri|null $route): static
    {
        $this->route = $route;

        return $this;
    }

    /**
     * @param  string|RouteUri|null  $route
     *
     * @return  static  Return self to support chaining.
     */
    public function setRoute(string|RouteUri|null $route): static
    {
        $this->route = $route;

        return $this;
    }

    protected function prepareQuery(Query $query): void
    {
    }

    protected function getItem(): ?array
    {
        return $this->once(
            'item',
            function () {
                $keyField = $this->getKeyField();
                $value    = $this->getValue();

                return $this->compileQuery()
                    ->where($keyField, $value)
                    ->get()
                    ?->dump();
            }
        );
    }

    public function getItems(): array
    {
        return $this->once(
            'items',
            function () {
                $keyField = $this->getKeyField();
                $value    = $this->getValue();

                if (is_string($value)) {
                    if (is_json($value)) {
                        $value = json_decode($value, true);
                    } else {
                        $value = Arr::explodeAndClear(',', $value);
                    }
                }

                $value = (array) $value;

                if ($value === []) {
                    return [];
                }

                $keyName = explode('.', $keyField);
                $keyName = array_pop($keyName);

                $items = $this->compileQuery()
                    ->where($keyField, $value)
                    ->all()
                    ->keyBy($keyName);

                $items = $this->prepareItems($items);

                if (!$this->isSortable()) {
                    return array_values($items);
                }

                $sortedItems = [];

                foreach ($value as $id) {
                    if ($items[$id] ?? null) {
                        $sortedItems[$id] = $items[$id];
                    }
                }

                return array_values($sortedItems);
            }
        );
    }

    /**
     * prepareItems
     *
     * @param  iterable  $items
     *
     * @return array
     * @since  1.7.3
     */
    protected function prepareItems(iterable $items): array
    {
        $keyField   = $this->getKeyField();
        $titleField = $this->getTitleField();
        $imageField = $this->getImageField();

        $keyName = explode('.', $keyField);
        $keyName = array_pop($keyName);

        $data = [];

        foreach ($items as $i => $item) {
            $datum['title'] = $item->$titleField;
            $datum['value'] = $item->$keyName;
            $datum['image'] = $item->$imageField;

            $data[$i] = $datum;
        }

        return $data;
    }

    public function getDb(): DatabaseAdapter
    {
        $connection = $this->getConnection();

        if ($connection instanceof DatabaseAdapter) {
            return $connection;
        }

        return $this->dbManager->get($connection);
    }

    /**
     * @return string
     */
    public function getTable(): ?string
    {
        return $this->table;
    }

    /**
     * @param  string  $table
     *
     * @return  static  Return self to support chaining.
     */
    public function table(string $table): static
    {
        $this->table = $table;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitleField(): string
    {
        return $this->titleField;
    }

    /**
     * @param  string  $titleField
     *
     * @return  static  Return self to support chaining.
     */
    public function titleField(string $titleField): static
    {
        $this->titleField = $titleField;

        return $this;
    }

    /**
     * @return string
     */
    public function getKeyField(): string
    {
        return $this->keyField;
    }

    /**
     * @param  string  $keyField
     *
     * @return  static  Return self to support chaining.
     */
    public function keyField(string $keyField): static
    {
        $this->keyField = $keyField;

        return $this;
    }

    /**
     * @return string
     */
    public function getImageField(): string
    {
        return $this->imageField;
    }

    /**
     * @param  string  $imageField
     *
     * @return  static  Return self to support chaining.
     */
    public function imageField(string $imageField): static
    {
        $this->imageField = $imageField;

        return $this;
    }

    /**
     * @return UriInterface|string
     */
    public function getUrl(): UriInterface|string
    {
        $url = $this->url ?? $this->getDefaultUrl();

        if ($url === null) {
            throw new \LogicException(
                sprintf(
                    'No URL for field: %s, please provide a URL or route name',
                    static::class
                )
            );
        }

        return $url;
    }

    protected function getDefaultUrl(): UriInterface|string|null
    {
        $route = $this->getRoute();

        if (!$route) {
            return null;
        }

        if (!$route instanceof RouteUri) {
            $route = $this->nav->to($route);
        }

        return $route->layout('modal')
            ->var('callback', $this->getCallback());
    }

    /**
     * @param  UriInterface|string  $route
     *
     * @return  static  Return self to support chaining.
     */
    public function url(UriInterface|string $route): static
    {
        $this->url = $route;

        return $this;
    }

    public function getCallback(): string
    {
        return $this->get('callback') ?? 'unicornModalFieldSelect_' . md5($this->getId());
    }

    /**
     * getAccessors
     *
     * @return  array
     */
    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            [
                'view',
                'table',
                'query',
                'titleClass',
                'callback',
                'buttonText',
                'layout',
                'multiple',
                // 'listType',
                'itemTemplate',
                'hasImage',
                'sortable',
                'placeholder',
                'onchange',
                'onfocus',
                'onblur',
                'height',
                'max',
            ]
        );
    }
}

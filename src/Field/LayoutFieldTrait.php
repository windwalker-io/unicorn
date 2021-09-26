<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Field;

use Windwalker\Core\Renderer\RendererService;
use Windwalker\DI\Attributes\Inject;

/**
 * Trait LayoutFieldTrait
 */
trait LayoutFieldTrait
{
    protected ?string $layout = null;

    #[Inject]
    protected RendererService $renderer;

    public function renderLayout(string $layout, array $data = []): string
    {
        return $this->renderer->render($layout, $data);
    }

    abstract public function getDefaultLayout(): string;

    /**
     * @return string
     */
    public function getLayout(): string
    {
        return $this->layout ?? $this->getDefaultLayout();
    }

    /**
     * @param  string|null  $layout
     *
     * @return  static  Return self to support chaining.
     */
    public function layout(?string $layout): static
    {
        $this->layout = $layout;

        return $this;
    }
}

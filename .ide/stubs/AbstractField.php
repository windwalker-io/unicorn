<?php

declare(strict_types=1);

namespace Windwalker\Form\Field;

class AbstractField
{
    public function showon(array $values): static
    {
        return $this;
    }

    public function tooltip(string $title): static
    {
        return $this;
    }
}

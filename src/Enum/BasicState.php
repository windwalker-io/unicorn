<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2021 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Unicorn\Enum;

use MyCLabs\Enum\Enum;
use Windwalker\Utilities\Contract\LanguageInterface;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;

/**
 * The State class.
 *
 * @method static static UNPUBLISHED()
 * @method static static PUBLISHED()
 */
class BasicState extends Enum implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    public const UNPUBLISHED = 0;
    public const PUBLISHED = 1;

    /**
     * Creates a new value of some type
     *
     * @psalm-pure
     *
     * @param  mixed  $value
     *
     * @psalm-param T $value
     * @throws \UnexpectedValueException if incompatible type is given.
     */
    public function __construct($value)
    {
        $value = (string) $value === '' ? 0 : $value;

        parent::__construct($value);
    }

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('unicorn.state.' . $this->getKey());
    }
}

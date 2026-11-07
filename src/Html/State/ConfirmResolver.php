<?php

declare(strict_types=1);

namespace Unicorn\Html\State;

use Unicorn\Workflow\State;
use Unicorn\Workflow\Transition;

/**
 * Resolves the view-level confirm message of a state/transition item.
 *
 * $confirm can be:
 * - null|false: no confirm.
 * - true: default message for dangerous items only.
 * - string: custom message for dangerous items only.
 * - array: [key => string|true|false], key is transition name or state value.
 * - Closure(item, key): string|bool|null
 */
class ConfirmResolver
{
    public const DEFAULT_MESSAGE = 'Are you sure?';

    public static function resolve(
        mixed $confirm,
        Transition|State|StateOption $item,
        string $key,
        string $defaultMessage = self::DEFAULT_MESSAGE
    ): ?string {
        if ($confirm instanceof \Closure) {
            $confirm = $confirm($item, $key);
        } elseif (is_array($confirm)) {
            $confirm = $confirm[$key] ?? null;
        } elseif ($confirm !== null && $confirm !== false) {
            $confirm = static::isDangerous($item) ? $confirm : null;
        }

        if ($confirm === true) {
            return $defaultMessage;
        }

        if (is_string($confirm) && $confirm !== '') {
            return $confirm;
        }

        return null;
    }

    public static function isDangerous(Transition|State|StateOption $item): bool
    {
        return $item->isDangerous();
    }

    public static function toJsPrefix(?string $message): string
    {
        if ($message === null) {
            return '';
        }

        return 'confirm(' . json_encode($message, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . ') && ';
    }
}

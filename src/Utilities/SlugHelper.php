<?php
/**
 * Part of earth project.
 *
 * @copyright  Copyright (C) 2019 .
 * @license    LGPL-2.0-or-later
 */

namespace Unicorn\Utilities;

use THL\Pinyin;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\Filter\OutputFilter;

use function Windwalker\str;

/**
 * The SlugHelper class.
 *
 * @since  1.8.13
 */
class SlugHelper
{
    /**
     * Make slug safe.
     *
     * @param  string       $alias
     * @param  bool         $utf8
     * @param  string|null  $default
     * @param  int          $defaultLimit
     *
     * @return  string
     * @throws \Exception
     */
    public static function safe(
        string $alias,
        bool $utf8 = false,
        ?string $default = null,
        int $defaultLimit = 16
    ): string {
        $slug = static::slugify($alias, $utf8, $default, $defaultLimit);

        if (trim($slug) === '') {
            $slug = static::getDefaultSlug();
        }

        return $slug;
    }

    /**
     * slugify
     *
     * @param  string       $alias
     * @param  bool         $utf8
     * @param  string|null  $default
     * @param  int          $defaultLimit
     *
     * @return  string
     */
    public static function slugify(
        string $alias,
        bool $utf8 = false,
        ?string $default = null,
        int $defaultLimit = 16
    ): string {
        if ($utf8) {
            $alias = $alias ?: mb_substr($default, 0, $defaultLimit);

            return OutputFilter::stringURLUnicodeSlug($alias);
        }

        if ($alias === '' && (string) $default !== '') {
            $words = static::breakWords($default);

            $words = array_slice($words, 0, $defaultLimit);

            $alias = implode(' ', $words);
        }

        if (class_exists(Pinyin::class)) {
            $alias = (string) Pinyin::slug($alias, ['split' => 'phrase']);
        } elseif (function_exists('transliterator_transliterate')) {
            $alias = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $alias);
        }

        return OutputFilter::stringURLSafe($alias);
    }

    /**
     * breakWords
     *
     * @param  string  $text
     *
     * @return  array
     *
     * @since  1.8.13
     */
    public static function breakWords(string $text): array
    {
        // @see https://stackoverflow.com/a/43882448
        preg_match_all(
            '/\p{Hangul}|\p{Hiragana}|\p{Han}|\p{Katakana}|(\p{Latin}+)|(\p{Cyrillic}+)|\d+/u',
            str($text)->collapseWhitespaces()->__toString(),
            $matches
        );

        return $matches[0] ?? [];
    }

    /**
     * getDefaultSlug
     *
     * @return  string
     *
     * @throws \Exception
     *
     * @since  1.8.13
     */
    public static function getDefaultSlug(): string
    {
        return OutputFilter::stringURLSafe(Chronos::now('Y-m-d-H-i-s'));
    }
}

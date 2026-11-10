<?php

declare(strict_types=1);

namespace Unicorn\Tests\Html\State;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Html\State\ConfirmResolver;
use Unicorn\Html\State\StateOption;
use Unicorn\Workflow\State;
use Unicorn\Workflow\Transition;

final class ConfirmResolverTest extends TestCase
{
    #[Test]
    public function dangerousFlagDefaultsToFalseAndIsChainable(): void
    {
        foreach ([new Transition('a', 'b', 'c'), new State('x'), new StateOption('x')] as $item) {
            self::assertFalse($item->isDangerous());
            self::assertSame($item, $item->dangerous());
            self::assertTrue($item->isDangerous());
            $item->dangerous(false);
            self::assertFalse($item->isDangerous());
        }
    }

    #[Test]
    public function resolvesEachConfirmType(): void
    {
        $safe = new Transition('safe', 'a', 'b');
        $danger = new Transition('danger', 'a', 'c')->dangerous();

        self::assertNull(ConfirmResolver::resolve(null, $danger, 'danger'));
        self::assertNull(ConfirmResolver::resolve(false, $danger, 'danger'));
        self::assertSame('Are you sure?', ConfirmResolver::resolve(true, $danger, 'danger'));
        self::assertNull(ConfirmResolver::resolve(true, $safe, 'safe'));
        self::assertSame('Msg', ConfirmResolver::resolve('Msg', $danger, 'danger'));
        self::assertNull(ConfirmResolver::resolve('Msg', $safe, 'safe'));
        self::assertSame('Sure', ConfirmResolver::resolve(true, $danger, 'danger', 'Sure'));

        self::assertSame('Arr', ConfirmResolver::resolve(['safe' => 'Arr'], $safe, 'safe'));
        self::assertSame('Sure', ConfirmResolver::resolve(['safe' => true], $safe, 'safe', 'Sure'));
        self::assertNull(ConfirmResolver::resolve(['safe' => false], $safe, 'safe'));
        self::assertNull(ConfirmResolver::resolve(['other' => 'x'], $safe, 'safe'));

        $closure = static fn($item, $key) => $key . ':' . $item->getName();

        self::assertSame('safe:safe', ConfirmResolver::resolve($closure, $safe, 'safe'));
    }

    #[Test]
    public function buildsJsPrefix(): void
    {
        self::assertSame('', ConfirmResolver::toJsPrefix(null));
        self::assertSame('confirm("a\"b/確定") && ', ConfirmResolver::toJsPrefix('a"b/確定'));
    }
}

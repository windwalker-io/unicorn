<?php

declare(strict_types=1);

namespace Unicorn\Tests\Form;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Form\Event\BuildFormFieldEvent;
use Unicorn\Form\FormFieldsBuilder;
use Windwalker\Database\Schema\Ddl\Column;
use Windwalker\Database\Manager\TableManager;
use Windwalker\Event\BaseEvent;

/**
 * The BuildFormFieldEventTest class.
 */
final class BuildFormFieldEventTest extends TestCase
{
    private Column $column;

    private FormFieldsBuilder $builder;

    protected function setUp(): void
    {
        $this->column = new Column('title', 'varchar');
        $this->builder = new FormFieldsBuilder('Foo\\Bar', $this->createStub(TableManager::class));
    }

    #[Test]
    public function defaultsAreAppliedWhenOnlyRequiredArgumentsGiven(): void
    {
        $event = new BuildFormFieldEvent($this->column, $this->builder);

        self::assertSame($this->column, $event->column);
        self::assertSame($this->builder, $event->formFieldsBuilder);
        self::assertSame('', $event->label);
        self::assertNull($event->code);
    }

    #[Test]
    public function constructorArgumentsAreStored(): void
    {
        $event = new BuildFormFieldEvent($this->column, $this->builder, 'Title', 'code-here');

        self::assertSame('Title', $event->label);
        self::assertSame('code-here', $event->code);
    }

    #[Test]
    public function eventIsBaseEvent(): void
    {
        $event = new BuildFormFieldEvent($this->column, $this->builder);

        self::assertInstanceOf(BaseEvent::class, $event);
    }

    #[Test]
    public function propertiesAreMutable(): void
    {
        $event = new BuildFormFieldEvent($this->column, $this->builder);

        $event->label = 'Changed';
        $event->code = 'new-code';

        self::assertSame('Changed', $event->label);
        self::assertSame('new-code', $event->code);
    }
}

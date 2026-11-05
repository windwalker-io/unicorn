<?php

declare(strict_types=1);

namespace Unicorn\Tests\Form;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Form\Event\BuildFormFieldEvent;
use Unicorn\Form\FormFieldsBuilder;
use Windwalker\Database\Manager\TableManager;
use Windwalker\Database\Schema\Ddl\Column;

/**
 * Verifies column-type to form-field code generation and unicorn lang key mapping
 * without touching a real database or filesystem.
 */
final class FormFieldsBuilderTest extends TestCase
{
    private TableManager $table;

    protected function setUp(): void
    {
        $this->table = $this->createStub(TableManager::class);
    }

    private function builder(?string $langPrefix = null, ?callable $listener = null): TestableFormFieldsBuilder
    {
        return new TestableFormFieldsBuilder('Fake\\Form', $this->table, $langPrefix, $listener);
    }

    private function column(string $name, string $dataType, array $options = []): Column
    {
        $column = new Column($name, $dataType, false, null);

        if (isset($options['custom_length'])) {
            $column->erratas(['custom_length' => $options['custom_length']]);
        }

        if (isset($options['erratas'])) {
            $column->erratas($options['erratas']);
        }

        return $column;
    }

    #[Test]
    public function unicornLangKeyMapsKnownColumns(): void
    {
        $builder = $this->builder();

        foreach (
            [
                'id',
                'title',
                'alias',
                'description',
                'ordering',
                'parent',
                'delete',
                'created',
                'modified',
                'modified_by',
                'image',
                'images',
                'type',
            ] as $name
        ) {
            self::assertSame('unicorn.field.' . $name, $builder->lang($name), $name);
        }
    }

    #[Test]
    public function unicornLangKeyMapsPublishedAndAuthorAliases(): void
    {
        $builder = $this->builder();

        self::assertSame('unicorn.field.published', $builder->lang('state'));
        self::assertSame('unicorn.field.published', $builder->lang('published'));
        self::assertSame('unicorn.field.author', $builder->lang('created_by'));
    }

    #[Test]
    public function unicornLangKeyReturnsNullForUnknownColumn(): void
    {
        self::assertNull($this->builder()->lang('custom_thing'));
    }

    #[Test]
    public function jsonColumnIsSkipped(): void
    {
        $column = $this->column('params', 'text', ['erratas' => ['is_json' => true]]);

        self::assertSame('', $this->builder()->field($column));
    }

    #[Test]
    public function autoIncrementColumnBecomesHiddenField(): void
    {
        $column = $this->column('id', 'int');
        $column->autoIncrement(true);

        $code = $this->builder()->field($column);

        self::assertStringContainsString('HiddenField::class', $code);
        self::assertStringContainsString("'id'", $code);
    }

    #[Test]
    public function stateTinyintBecomesSwitcherField(): void
    {
        $code = $this->builder()->field($this->column('state', 'tinyint'));

        self::assertStringContainsString('SwitcherField::class', $code);
        self::assertStringContainsString('unicorn.field.published', $code);
        self::assertStringContainsString('circle(true)', $code);
        self::assertStringContainsString("'success'", $code);
        self::assertStringContainsString("defaultValue('1')", $code);
    }

    #[Test]
    public function tinyintWithLengthOneBecomesPrimarySwitcher(): void
    {
        $column = $this->column('enabled', 'tinyint', ['custom_length' => '1']);

        $code = $this->builder()->field($column);

        self::assertStringContainsString('SwitcherField::class', $code);
        self::assertStringContainsString("'primary'", $code);
    }

    #[Test]
    public function datetimeAndTimestampBecomeCalendarField(): void
    {
        foreach (['datetime', 'timestamp'] as $type) {
            $code = $this->builder()->field($this->column('created', $type));

            self::assertStringContainsString('CalendarField::class', $code, $type);
        }
    }

    #[Test]
    public function integerTypesBecomeNumberField(): void
    {
        foreach (['tinyint', 'int', 'integer', 'bigint'] as $type) {
            $code = $this->builder()->field($this->column('quantity', $type, ['custom_length' => '4']));

            self::assertStringContainsString('NumberField::class', $code, $type);
        }
    }

    #[Test]
    public function floatWithZeroScaleUsesIntegerStep(): void
    {
        $column = $this->column('price', 'decimal');
        $column->numericScale(0);

        $code = $this->builder()->field($column);

        self::assertStringContainsString('NumberField::class', $code);
        self::assertStringContainsString("step('1')", $code);
    }

    #[Test]
    public function floatWithScaleUsesDecimalStep(): void
    {
        $column = $this->column('price', 'decimal');
        $column->numericScale(2);

        $code = $this->builder()->field($column);

        self::assertStringContainsString('NumberField::class', $code);
        self::assertStringContainsString("step('0.01')", $code);
    }

    #[Test]
    public function textTypesBecomeTextareaField(): void
    {
        foreach (['text', 'mediumtext', 'longtext'] as $type) {
            $code = $this->builder()->field($this->column('content', $type));

            self::assertStringContainsString('TextareaField::class', $code, $type);
            self::assertStringContainsString('rows(7)', $code, $type);
        }
    }

    #[Test]
    public function defaultTypeBecomesTextField(): void
    {
        $code = $this->builder()->field($this->column('code', 'varchar'));

        self::assertStringContainsString('TextField::class', $code);
        self::assertStringNotContainsString('required', $code);
    }

    #[Test]
    public function titleAndNameAreRequiredAndTrimmed(): void
    {
        foreach (['title', 'name'] as $name) {
            $code = $this->builder()->field($this->column($name, 'varchar'));

            self::assertStringContainsString('TextField::class', $code, $name);
            self::assertStringContainsString('required(true)', $code, $name);
            self::assertStringContainsString("addFilter('trim')", $code, $name);
        }
    }

    #[Test]
    public function langPrefixIsUsedForNonUnicornColumns(): void
    {
        $code = $this->builder('app.item')->field($this->column('custom_thing', 'varchar'));

        self::assertStringContainsString('app.item.custom_thing', $code);
    }

    #[Test]
    public function eventCodeOverridesGeneratedCode(): void
    {
        $builder = $this->builder(
            listener: static function (BuildFormFieldEvent $event): void {
                $event->code = "'custom-field-code';";
            }
        );

        $code = $builder->field($this->column('code', 'varchar'));

        self::assertSame("'custom-field-code';", $code);
    }
}

/**
 * Exposes protected members of FormFieldsBuilder and replaces event dispatching
 * so tests do not need a configured event dispatcher.
 */
class TestableFormFieldsBuilder extends FormFieldsBuilder
{
    private ?\Closure $listener = null;

    public function __construct(string $className, TableManager $table, ?string $langPrefix = null, ?callable $listener = null)
    {
        parent::__construct($className, $table);

        $this->langPrefix = $langPrefix;
        $this->listener = $listener === null ? null : \Closure::fromCallable($listener);
    }

    public function lang(string $name): ?string
    {
        return $this->getUnicornLangKey($name);
    }

    public function field(Column $column): string
    {
        return $this->getFieldByColumnType($column);
    }

    public function emit(object|string $event, array $args = []): object
    {
        if ($this->listener !== null && $event instanceof BuildFormFieldEvent) {
            ($this->listener)($event);
        }

        return is_object($event) ? $event : new \stdClass();
    }
}

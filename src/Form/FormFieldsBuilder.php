<?php

declare(strict_types=1);

namespace Unicorn\Form;

use PhpParser\Node;
use PhpParser\ParserFactory;
use Unicorn\Field\CalendarField;
use Unicorn\Field\SwitcherField;
use Unicorn\Form\Event\BuildFormFieldEvent;
use Windwalker\Core\Event\CoreEventAwareTrait;
use Windwalker\Core\Generator\Builder\AbstractAstBuilder;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\Database\Manager\TableManager;
use Windwalker\Database\Schema\Ddl\Column;
use Windwalker\Event\EventAwareInterface;
use Windwalker\Event\EventAwareTrait;
use Windwalker\Form\Field\HiddenField;
use Windwalker\Form\Field\NumberField;
use Windwalker\Form\Field\TextareaField;
use Windwalker\Form\Field\TextField;
use Windwalker\Utilities\Str;
use Windwalker\Utilities\StrNormalize;

/**
 * The FormFieldsBuilder class.
 */
class FormFieldsBuilder extends AbstractAstBuilder implements EventAwareInterface
{
    use CoreEventAwareTrait;

    protected array $uses = [];
    protected array $newUses = [];
    protected bool|string|null $langPrefix = null;
    protected bool $hasTranslations = false;
    protected ?Node\Stmt\ClassMethod $methodFound = null;

    /**
     * FormFieldsBuilder constructor.
     */
    public function __construct(protected string $className, protected TableManager $table)
    {
    }

    /**
     * @param  Node\Stmt\ClassMethod  $node
     *
     * @return  bool
     */
    protected function isFormDefineMethod(Node\Stmt\ClassMethod $node): bool
    {
        if ($node->name->name === 'define') {
            return true;
        }

        foreach ($node->getAttrGroups() as $attrGroup) {
            foreach ($attrGroup->attrs as $attr) {
                if ((string) $attr->name === 'FormDefine') {
                    return true;
                }
            }
        }

        return false;
    }

    protected function getDb(): DatabaseAdapter
    {
        return $this->table->getDb();
    }

    public function process(array $options = [], ?array &$added = null): string
    {
        $added = [];
        $ref = new \ReflectionClass($this->getClassName());
        $this->langPrefix = $options['use-lang'] ?? null;

        $columns       = $this->table->getColumnNames(true);
        $existsColumns = [];
        $factory       = $this->createNodeFactory();
        $fields        = [];

        $leaveNode = function (Node $node) use ($ref, $factory, &$existsColumns, $columns, &$fields, &$added) {
            if ($node instanceof Node\Stmt\UseUse) {
                $this->uses[] = (string) $node->name;
            }

            if (
                $node instanceof Node\Expr\MethodCall
                && $node->name->name === 'add'
                && $node->args[0]->value instanceof Node\Scalar\String_
            ) {
                $existsColumns[] = $node->args[0]->value->value;
            }

            if (
                $node instanceof Node\Stmt\ClassMethod
            ) {
                if ($this->isFormDefineMethod($node)) {
                    $this->methodFound = $node;
                }
            }

            if ($node instanceof Node\Stmt\Namespace_) {
                $uses = array_unique($this->newUses);

                foreach ($uses as $use) {
                    array_unshift($node->stmts, $factory->use($use)->getNode());
                }
            }

            if ($node instanceof Node\Stmt\Class_) {
                if (!$this->methodFound) {
                    $factory = $this->createNodeFactory();

                    $method = $factory->method('define')
                        ->makePublic()
                        ->addParam(
                            $factory->param('form')
                                ->setType('Form')
                        )
                        ->addAttribute(
                            new Node\Attribute(
                                new Node\Name('FormDefine')
                            )
                        )
                        ->setReturnType('void')
                        ->getNode();

                    $node->stmts[] = $method;

                    $this->methodFound = $method;
                }

                $this->methodFound->stmts[] = new Node\Stmt\Expression(new Node\Scalar\String_('@replace-line'));

                $columns = array_diff($columns, $existsColumns);

                foreach ($columns as $column) {
                    $added[] = $column;

                    $field = $this->createFieldDefine($column);

                    if ($field) {
                        $fields[] = $field;
                    }
                }

                if ($this->hasTranslations && !in_array(TranslatorTrait::class, $ref->getTraitNames(), true)) {
                    $this->addUse(TranslatorTrait::class);
                    // $this->addUse(Inject::class);

                    $use = $factory->use('TranslatorTrait')
                        ->getNode();

                    array_unshift($node->stmts, $use);
                }
            }
        };

        $newCode = $this->convertCode(
            file_get_contents($ref->getFileName()),
            null,
            $leaveNode
        );

        $addFields = implode("\n\n", $fields);
        return str_replace(
            "        '@replace-line';",
            $addFields,
            $newCode
        );
    }

    protected function createFieldDefine(string $columnName): string
    {
        $column = $this->table->getColumn($columnName);

        return $this->getFieldByColumnType($column);
    }

    protected function getFieldByColumnType(Column $column): string
    {
        if ($column->getErratas()['is_json'] ?? false) {
            return '';
        }

        $colName = $column->getColumnName();

        if ($lang = $this->getUnicornLangKey($colName)) {
            $this->hasTranslations = true;
            $label = "\$this->trans('" . $lang . "')";
        } elseif ($this->langPrefix) {
            $this->hasTranslations = true;
            $lang = $this->getLangKey($this->langPrefix, $colName);
            $label = "\$this->trans('" . $lang . "')";
        } else {
            $label = Str::surrounds(
                $column->getComment() ?: StrNormalize::toSpaceSeparated(
                    StrNormalize::toPascalCase($column->getColumnName())
                ),
                "'"
            );
        }

        $event = $this->emit(
            BuildFormFieldEvent::class,
            [
                'column' => $column,
                'label' => $label,
                'formFieldsBuilder' => $this
            ]
        );

        if ($event->getCode() !== null) {
            return $event->getCode();
        }

        if ($column->isAutoIncrement()) {
            $this->addUse(HiddenField::class);
            return <<<PHP
        \$form->add('$colName', HiddenField::class);
PHP;
        }

        switch ($column->getDataType()) {
            case $colName === 'state' && $column->getDataType() === 'tinyint':
                $this->addUse(SwitcherField::class);

                return <<<PHP
        \$form->add('$colName', SwitcherField::class)
            ->label($label)
            ->circle(true)
            ->color('success')
            ->defaultValue('1');
PHP;

            case $column->getDataType() === 'tinyint' && (string) $column->getErratas()['custom_length'] === '1':
                $this->addUse(SwitcherField::class);

                return <<<PHP
        \$form->add('$colName', SwitcherField::class)
            ->label($label)
            ->circle(true)
            ->color('primary');
PHP;

            case 'datetime':
            case 'timestamp':
                $this->addUse(CalendarField::class);

                return <<<PHP
        \$form->add('$colName', CalendarField::class)
            ->label($label);
PHP;

            case 'tinyint':
            case 'number':
            case 'integer':
            case 'int':
                $this->addUse(NumberField::class);

                return <<<PHP
        \$form->add('$colName', NumberField::class)
            ->label($label);
PHP;

            case 'float':
            case 'decimal':
                $this->addUse(NumberField::class);
                $scale = $column->getNumericScale();
                $step = 1;

                if ($scale > 0) {
                    $step = '0.' . (str_repeat('0', $scale - 1)) . '1';
                }

                return <<<PHP
        \$form->add('$colName', NumberField::class)
            ->label($label)
            ->step('$step');
PHP;

            case 'text':
            case 'mediumtext':
            case 'longtext':
                $this->addUse(TextareaField::class);

                return <<<PHP
        \$form->add('$colName', TextareaField::class)
            ->label($label)
            ->rows(7);
PHP;

            default:
                $this->addUse(TextField::class);

                $extra = '';

                if ($colName === 'title' || $colName === 'name') {
                    $extra = "\n            ->required(true)"
                        . "\n            ->addFilter('trim')";
                }

                return <<<PHP
        \$form->add('$colName', TextField::class)
            ->label($label)$extra;
PHP;
        }
    }

    protected function createParser(): \PhpParser\Parser
    {
        return (new ParserFactory())->create(ParserFactory::PREFER_PHP7);
    }

    /**
     * @return string
     */
    public function getClassName(): string
    {
        return $this->className;
    }

    public function addUse(string $ns): void
    {
        if (!in_array($ns, $this->uses, true)) {
            $this->newUses[] = $ns;
        }
    }

    protected function getLangKey(string $langPrefix, string $colName): string
    {
        return $this->getUnicornLangKey($colName) ?? $langPrefix . '.' . $colName;
    }

    protected function getUnicornLangKey(string $columnName): ?string
    {
        return match ($columnName) {
            'id', 'title', 'alias', 'description', 'ordering', 'parent', 'delete', 'created', 'modified',
            'modified_by', 'image', 'images', 'type' => 'unicorn.field.' . $columnName,
            'state', 'published' => 'unicorn.field.published',
            'created_by' => 'unicorn.field.author',
            default => null
        };
    }
}

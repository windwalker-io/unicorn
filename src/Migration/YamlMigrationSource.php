<?php

declare(strict_types=1);

namespace Unicorn\Migration;

use Symfony\Component\Yaml\Yaml;

/**
 * Reads table definitions from a YAML file. This format is YAML-specific and does not need
 * to stay compatible with the Excel format.
 *
 * Template: resources/tmpl/schema.yml
 * JSON Schema (IDE completion / validation): resources/tmpl/schema.json
 * Any change to the YAML format MUST be reflected in both files.
 *
 * Top-level keys are table names. Each table is a map of:
 * - description: Table description (informational, no function yet).
 * - columns: Map of column name => attributes. A scalar value is a shorthand for the type.
 * - keys: Map of primary / index / unique. Each takes a column name or a list; for index / unique, a list
 *   item is one key (a column name, or a list of names for a composite key; "name(150)" sets a prefix length).
 *   Key names are generated automatically.
 *
 * Column attribute keys are case-insensitive and accept "Key" / "key"; unknown ones are rejected.
 * "enum" (class name) is the same as writing "enum:Foo" in the Excel Note column.
 *
 * The result is the source-independent TableDefinition / ColumnDefinition, same as other sources.
 * "type" may carry a length, e.g. varchar(255) or decimal(20,4); it conflicts with "length".
 * Column "nullable" (bool) allows NULL; "signed" (bool, default true) makes it unsigned when false; "primary" (bool) marks a primary key; "serial" (bool, int/bigint only) makes it auto-increment.
 *
 * This is not a full schema AST, keep it a thin description for generating migrations.
 */
class YamlMigrationSource extends AbstractMigrationSource
{
    protected const array TABLE_KEYS = ['description', 'columns', 'keys'];

    protected const array KEY_TYPES = ['primary', 'index', 'unique'];

    protected const array COLUMN_KEYS = [
        'Type',
        'Length',
        'Nullable',
        'Signed',
        'Default',
        'Primary',
        'Serial',
        'Enum',
        'Description',
        'Note',
    ];

    public function analyze(string $source): MigrationSourceAnalysis
    {
        if (!class_exists(Yaml::class)) {
            throw new \DomainException('Please install symfony/yaml first.');
        }

        if (!is_file($source)) {
            throw new \InvalidArgumentException(sprintf('YAML file "%s" not found.', $source));
        }

        $data = Yaml::parseFile($source);

        if (!is_array($data)) {
            throw new \UnexpectedValueException(
                sprintf('YAML file "%s" must be a map of table names to table definitions.', $source)
            );
        }

        return $this->buildAnalysis($this->parseTables($data));
    }

    /**
     * @param  array<string, mixed>  $data
     *
     * @return  \Generator<int, TableDefinition>
     */
    protected function parseTables(array $data): \Generator
    {
        foreach ($data as $tableName => $table) {
            if (!$this->isTableName($tableName)) {
                continue;
            }

            if (!is_array($table)) {
                throw new \UnexpectedValueException(
                    sprintf('Table "%s" must be a map with "columns" and optional "keys".', $tableName)
                );
            }

            $unknown = array_diff(array_keys($table), self::TABLE_KEYS);

            if ($unknown !== []) {
                throw new \UnexpectedValueException(
                    sprintf(
                        'Unknown option "%s" in table "%s". Allowed: %s.',
                        implode('", "', array_map('strval', $unknown)),
                        $tableName,
                        implode(', ', self::TABLE_KEYS)
                    )
                );
            }

            $columns = $table['columns'] ?? null;

            if (!is_array($columns) || $columns === []) {
                throw new \UnexpectedValueException(
                    sprintf('Table "%s" must have a non-empty "columns" map.', $tableName)
                );
            }

            $defs = [];

            foreach ($columns as $name => $attrs) {
                if (!is_string($name)) {
                    throw new \UnexpectedValueException(
                        sprintf('"columns" of table "%s" must be a map of column name => attributes.', $tableName)
                    );
                }

                $defs[$name] = $this->buildColumn($name, $attrs, $tableName);
            }

            $keys = $this->parseKeys($table['keys'] ?? [], $defs, $tableName);

            yield new TableDefinition(
                name: $tableName,
                columns: array_values($defs),
                description: (string) ($table['description'] ?? ''),
                primary: $keys['primary'] ?? [],
                indexes: $keys['index'] ?? [],
                uniques: $keys['unique'] ?? [],
            );
        }
    }

    /**
     * @param  array<string, ColumnDefinition>  $rows
     *
     * @return  array{primary?: list<string>, index?: list<list<string>>, unique?: list<list<string>>}
     */
    protected function parseKeys(mixed $keys, array $rows, string $tableName): array
    {
        if (!is_array($keys) || ($keys !== [] && array_is_list($keys))) {
            throw new \UnexpectedValueException(
                sprintf('"keys" of table "%s" must be a map of primary / index / unique.', $tableName)
            );
        }

        $unknown = array_diff(array_keys($keys), self::KEY_TYPES);

        if ($unknown !== []) {
            throw new \UnexpectedValueException(
                sprintf(
                    'Unknown key type "%s" in table "%s". Allowed: %s.',
                    implode('", "', array_map('strval', $unknown)),
                    $tableName,
                    implode(', ', self::KEY_TYPES)
                )
            );
        }

        $result = [];

        foreach ($keys as $type => $def) {
            if ($type === 'primary') {
                $cols = (array) $def;

                if ($cols === [] || array_filter($cols, fn($c) => !is_string($c))) {
                    throw new \UnexpectedValueException(
                        sprintf('"keys.primary" of table "%s" must be a column name or a list of them.', $tableName)
                    );
                }

                $result['primary'] = array_values($this->checkColumns($cols, $rows, $tableName, 'primary', false));

                continue;
            }

            // A string or a list of strings means one single-column key per item.
            foreach ((array) $def as $item) {
                $cols = (array) $item;

                if ($cols === [] || array_filter($cols, fn($c) => !is_string($c))) {
                    throw new \UnexpectedValueException(
                        sprintf(
                            '"keys.%s" of table "%s" must contain column names or lists of column names.',
                            $type,
                            $tableName
                        )
                    );
                }

                $result[$type][] = array_values($this->checkColumns($cols, $rows, $tableName, $type, true));
            }
        }

        return $result;
    }

    /**
     * @param  list<string>                     $cols
     * @param  array<string, ColumnDefinition>  $rows
     *
     * @return  list<string>
     */
    protected function checkColumns(array $cols, array $rows, string $tableName, string $type, bool $prefix): array
    {
        foreach ($cols as $col) {
            // "name(150)" is a prefix length, only for index / unique.
            $pure = $prefix ? preg_replace('/\(\d+\)$/', '', $col) : $col;

            if (!isset($rows[$pure])) {
                throw new \UnexpectedValueException(
                    sprintf('"keys.%s" of table "%s" refers to unknown column "%s".', $type, $tableName, $col)
                );
            }

            if ($type === 'primary' && $rows[$pure]->primary) {
                throw new \UnexpectedValueException(
                    sprintf('Column "%s.%s" is already marked as primary.', $tableName, $col)
                );
            }
        }

        return $cols;
    }

    protected function buildColumn(string $name, mixed $attrs, string $tableName): ColumnDefinition
    {
        if (is_scalar($attrs)) {
            $attrs = ['Type' => $attrs];
        }

        $attrs ??= [];

        if (!is_array($attrs)) {
            throw new \UnexpectedValueException(
                sprintf('Column "%s.%s" must be a map of attributes or a type string.', $tableName, $name)
            );
        }

        $text = ['Type' => '', 'Length' => '', 'Default' => '', 'Description' => '', 'Note' => '', 'Enum' => ''];
        $flags = ['Nullable' => false, 'Signed' => true, 'Primary' => false, 'Serial' => false];

        foreach ($attrs as $key => $value) {
            $header = $this->normalizeKey((string) $key);

            if (isset($flags[$header])) {
                if (!is_bool($value)) {
                    throw new \UnexpectedValueException(
                        sprintf('Column "%s.%s": "%s" must be a boolean.', $tableName, $name, strtolower($header))
                    );
                }

                $flags[$header] = $value;

                continue;
            }

            if ($header === 'Enum' && (!is_string($value) || trim($value) === '')) {
                throw new \UnexpectedValueException(
                    sprintf('Column "%s.%s": "enum" must be a non-empty class name.', $tableName, $name)
                );
            }

            $text[$header] = trim($this->normalizeValue($value));
        }

        if (preg_match('/^(\w+)\s*\(\s*(\d+(?:\s*,\s*\d+)?)\s*\)$/', $text['Type'], $m)) {
            if ($text['Length'] !== '') {
                throw new \UnexpectedValueException(
                    sprintf('Column "%s.%s": "type" already has a length, remove "length".', $tableName, $name)
                );
            }

            $text['Type'] = $m[1];
            $text['Length'] = str_replace(' ', '', $m[2]);
        }

        if ($flags['Serial'] && !in_array($text['Type'], ['int', 'integer', 'bigint'], true)) {
            throw new \UnexpectedValueException(
                sprintf('Column "%s.%s": "serial" requires type int or bigint.', $tableName, $name)
            );
        }

        return new ColumnDefinition(
            name: $name,
            type: $text['Type'],
            length: $text['Length'] !== '' ? $text['Length'] : null,
            nullable: $flags['Nullable'],
            unsigned: !$flags['Signed'],
            default: $text['Default'] !== '' ? $text['Default'] : null,
            primary: $flags['Primary'],
            serial: $flags['Serial'],
            enum: $text['Enum'] !== '' ? $text['Enum'] : null,
            description: $text['Description'],
            note: $text['Note'],
        );
    }

    /**
     * Accepts "type", "key_name", "Key Name", "keyName" etc. and maps them to a column attribute name.
     */
    protected function normalizeKey(string $key): string
    {
        $map = [];

        foreach (self::COLUMN_KEYS as $header) {
            $map[strtolower(str_replace([' ', '_', '-'], '', $header))] = $header;
        }

        $id = strtolower(str_replace([' ', '_', '-'], '', $key));

        return $map[$id] ?? throw new \UnexpectedValueException(
            sprintf('Unknown column attribute "%s". Allowed: %s.', $key, implode(', ', self::COLUMN_KEYS))
        );
    }

    /**
     * Attribute values are handled as strings, same as Excel formatted values.
     */
    protected function normalizeValue(mixed $value): string
    {
        return match (true) {
            $value === null => '',
            is_bool($value) => $value ? 'true' : 'false',
            is_scalar($value) => (string) $value,
            default => throw new \UnexpectedValueException('Column values must be scalar.'),
        };
    }
}

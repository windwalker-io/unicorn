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
 * "type" may carry a length, e.g. varchar(255) or decimal(20,4); it conflicts with "length".
 * Column "nullable" (bool) allows NULL; "primary" (bool) marks a primary key; "serial" (bool, int/bigint only) makes it auto-increment.
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

        $tableKeys = [];
        $tables = $this->parseTables($data, $tableKeys);

        return $this->buildAnalysis($tables, $tableKeys);
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, mixed>  $tableKeys  Filled with table-level keys by table name.
     *
     * @return  array<string, array<int, array<string, string>>>
     */
    protected function parseTables(array $data, array &$tableKeys): array
    {
        $tables = [];

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

            $rows = [];

            foreach ($columns as $name => $attrs) {
                if (!is_string($name)) {
                    throw new \UnexpectedValueException(
                        sprintf('"columns" of table "%s" must be a map of column name => attributes.', $tableName)
                    );
                }

                $rows[$name] = $this->buildRow($name, $attrs, $tableName);
            }

            $keys = $this->parseKeys($table['keys'] ?? [], $rows, $tableName);

            if ($keys !== []) {
                $tableKeys[$tableName] = $keys;
            }

            $tables[$tableName] = array_values($rows);
        }

        return $tables;
    }

    /**
     * @param  array<string, array<string, string>>  $rows
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
     * @param  list<string>                          $cols
     * @param  array<string, array<string, string>>  $rows
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

            if ($type === 'primary' && (($rows[$pure]['Key'] ?? '') !== '')) {
                throw new \UnexpectedValueException(
                    sprintf('Column "%s.%s" is already marked as primary.', $tableName, $col)
                );
            }
        }

        return $cols;
    }

    /**
     * @return  array<string, string>
     */
    protected function buildRow(string $name, mixed $attrs, string $tableName): array
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

        $row = ['Name' => $name];

        $flags = ['Nullable' => false, 'Primary' => false, 'Serial' => false];

        $enum = '';

        foreach ($attrs as $key => $value) {
            $header = $this->normalizeKey((string) $key);

            if ($header === 'Enum') {
                if (!is_string($value) || trim($value) === '') {
                    throw new \UnexpectedValueException(
                        sprintf('Column "%s.%s": "enum" must be a non-empty class name.', $tableName, $name)
                    );
                }

                $enum = trim($value);

                continue;
            }

            if (isset($flags[$header])) {
                if (!is_bool($value)) {
                    throw new \UnexpectedValueException(
                        sprintf('Column "%s.%s": "%s" must be a boolean.', $tableName, $name, strtolower($header))
                    );
                }

                $flags[$header] = $value;

                continue;
            }

            $row[$header] = $this->normalizeValue($value);
        }

        if (preg_match('/^(\w+)\s*\(\s*(\d+(?:\s*,\s*\d+)?)\s*\)$/', $row['Type'] ?? '', $m)) {
            if (($row['Length'] ?? '') !== '') {
                throw new \UnexpectedValueException(
                    sprintf('Column "%s.%s": "type" already has a length, remove "length".', $tableName, $name)
                );
            }

            $row['Type'] = $m[1];
            $row['Length'] = str_replace(' ', '', $m[2]);
        }

        if ($flags['Serial'] && !in_array($row['Type'] ?? '', ['int', 'integer', 'bigint'], true)) {
            throw new \UnexpectedValueException(
                sprintf('Column "%s.%s": "serial" requires type int or bigint.', $tableName, $name)
            );
        }

        // Same as writing "enum:Foo" in the Excel Note column.
        if ($enum !== '') {
            $row['Note'] = trim(($row['Note'] ?? '') . ' enum:' . $enum);
        }

        if ($flags['Nullable']) {
            $row['NULL'] = 'allow';
        }

        // "Primary (AI)" and "Primary" are the keywords the command understands.
        if ($flags['Primary'] && $flags['Serial']) {
            $row['Key'] = 'Primary (AI)';
        } elseif ($flags['Primary']) {
            $row['Key'] = 'Primary';
        } elseif ($flags['Serial']) {
            $row['Serial'] = 'true';
        }

        return $row;
    }

    /**
     * Accepts "type", "key_name", "Key Name", "keyName" etc. and maps them to the Excel header.
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
     * The command handles cells as strings, same as Excel formatted values.
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

<?php

declare(strict_types=1);

namespace Unicorn\Migration;

use Symfony\Component\Yaml\Yaml;

/**
 * Reads table definitions from a YAML file using the same columns as the Excel format.
 *
 * Top-level keys are table names (like Excel sheets), each holding a map of column name => attributes.
 * Attribute keys are case-insensitive and accept "key_name" / "Key Name" / "keyName".
 * A scalar value is a shorthand for the Type.
 *
 * ```yaml
 * users:
 *   id:
 *     type: int
 *     key: Primary (AI)
 *   email:
 *     type: varchar
 *     length: 255
 *     nullable: allow
 *     key: unique
 *     description: Login email
 *   name: varchar
 * ```
 *
 * Supported attributes: Type, Length, NULL, Signed, Default, Key, Key Name, Description, Note.
 */
class YamlMigrationSource extends AbstractMigrationSource
{
    protected const array COLUMN_KEYS = [
        'Type',
        'Length',
        'NULL',
        'Signed',
        'Default',
        'Key',
        'Key Name',
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
                sprintf('YAML file "%s" must be a map of table names to column lists.', $source)
            );
        }

        return $this->buildAnalysis($this->iterateTables($data));
    }

    /**
     * @param  array<string, mixed>  $data
     *
     * @return  \Generator<string, array<int, array<string, string>>>
     */
    protected function iterateTables(array $data): \Generator
    {
        foreach ($data as $tableName => $columns) {
            if (!$this->isTableName($tableName)) {
                continue;
            }

            if (!is_array($columns)) {
                throw new \UnexpectedValueException(
                    sprintf('Table "%s" must be a list of columns.', $tableName)
                );
            }

            $rows = [];

            foreach ($columns as $name => $attrs) {
                if (!is_string($name)) {
                    throw new \UnexpectedValueException(
                        sprintf('Table "%s" must be a map of column name => attributes, not a list.', $tableName)
                    );
                }

                $rows[] = $this->buildRow((string) $name, $attrs, $tableName);
            }

            if ($rows === []) {
                continue;
            }

            yield $tableName => $rows;
        }
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

        foreach ($attrs as $key => $value) {
            $row[$this->normalizeKey((string) $key)] = $this->normalizeValue($value);
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

        // A bare `null:` key is parsed as a non-string by YAML, so `nullable` is provided as an alias.
        $map['nullable'] = 'NULL';

        $id = strtolower(str_replace([' ', '_', '-'], '', $key));

        return $map[$id] ?? $key;
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

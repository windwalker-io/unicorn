<?php

declare(strict_types=1);

namespace Unicorn\Migration;

/**
 * Source-independent column description produced by every MigrationSourceInterface.
 */
final readonly class ColumnDefinition
{
    public function __construct(
        public string $name,
        public string $type,
        public ?string $length = null,
        public bool $nullable = false,
        public bool $unsigned = false,
        public ?string $default = null,
        public bool $primary = false,
        public bool $serial = false,
        public ?string $enum = null,
        public string $description = '',
        public string $note = '',
    ) {
    }

    public function getComment(): string
    {
        $parts = [
            $this->description,
            $this->note,
            $this->enum !== null && $this->enum !== '' ? 'enum:' . $this->enum : '',
        ];

        return implode(' - ', array_filter($parts, fn(string $part) => $part !== ''));
    }
}

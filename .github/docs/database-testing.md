# Database testing

Guidance for writing tests that touch a real `DatabaseAdapter` or ORM, such as
Repository CRUD methods (`save`, `getItem`, `mustGetItem`, `delete`).

Unicorn depends on `windwalker/core`, so the traits from core can be used
directly in unicorn tests.

## Choose a strategy

| Need | Use |
| --- | --- |
| Pure logic, no DB | Mocks/stubs (`createStub()` / `createMock()`) |
| Real SQL/ORM behavior, no host app, no DSN | `InMemoryDatabaseTestTrait` (SQLite `:memory:`) |
| Dialect-specific behavior (MySQL/PostgreSQL) | `DatabaseTestTrait` against a dedicated DSN |

SQLite is not fully dialect-equivalent to MySQL or PostgreSQL. Use an
external DBMS when a test depends on dialect-specific SQL or DDL.

## In-memory tests (default)

Use `Windwalker\Core\Testing\Traits\InMemoryDatabaseTestTrait`. It opens a
fresh `sqlite::memory:` connection before each test and disconnects after.
Override `prepareInMemoryDatabaseSchema()` to create tables and seed rows.

```php
use Windwalker\Core\Testing\Traits\InMemoryDatabaseTestTrait;
use Windwalker\Database\DatabaseAdapter;

class ExampleRepositoryTest extends TestCase
{
    use InMemoryDatabaseTestTrait;

    protected function prepareInMemoryDatabaseSchema(DatabaseAdapter $db): void
    {
        $db->execute('CREATE TABLE examples (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)');
    }
}
```

Inject the connection into the repository with `setDb($this->db)`. This avoids
the container lookup in `DatabaseRepositoryTrait::getDb()`.

## Real DBMS tests (opt-in)

Use `Windwalker\Core\Testing\Traits\DatabaseTestTrait` only when the test needs
the full host-app lifecycle (`AbstractTestApp`, migrations, ORM). It can drop
and recreate the configured database.

Rules:

- Use a dedicated, disposable database. Never use a shared, staging, or
  production database.
- Configure the DSN through `WINDWALKER_TEST_DB_DSN_*` in `phpunit.xml`. Leave
  it commented out by default so the suite is opt-in.
- Never run database suites in parallel.

For lighter real-DB tests without the app lifecycle, use the framework trait
`Windwalker\Test\Traits\DatabaseTestTrait` from `windwalker/test`. It skips
tests when no DSN is configured.

## Mock-based tests

Keep mock-based tests in the `Unit` suite. Use `createStub()` for return values
only, and `createMock()` with `expects()` when verifying interactions. In
PHPUnit 13, `->with()` must follow `->expects(...)`, and `createStub()` does
not support `->with()`.

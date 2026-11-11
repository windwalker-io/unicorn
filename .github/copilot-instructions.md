# Copilot instructions

`windwalker/unicorn` is a reusable PHP package that extends Windwalker Core; it
is not a host application. The `Unicorn\` namespace maps to `src/`, and the
package integrates its services and resources into a consuming host app.

## Where to find things

Load only the guidance needed for the task:

- [`../AGENTS.md`](../AGENTS.md): package scope and agent rules
- [`docs/index.md`](docs/index.md): documentation index
- https://windwalker.io/llms.txt: public Windwalker documentation index; fetch only the linked `.md` pages a task needs
- [`docs/architecture.md`](docs/architecture.md): package layout and host-app integration
- [`instructions/architecture.instructions.md`](instructions/architecture.instructions.md):
  mandatory placement and integration rules
- [`docs/locale-key-naming.md`](docs/locale-key-naming.md): **mandatory** to
  read before adding, renaming, or reusing any translation key
- [`instructions/i18n.instructions.md`](instructions/i18n.instructions.md):
  locale files, backend and frontend translation
- [`instructions/test-common.instructions.md`](instructions/test-common.instructions.md):
  test conventions
- [`instructions/test-coverage.instructions.md`](instructions/test-coverage.instructions.md):
  coverage exclusions
- [`skills/index.md`](skills/index.md): reusable task skills

## Scope

- Keep changes in this package. Do not apply host-application conventions to
  package code or assume a host app's name, location, routes, or configuration.
- Host-specific behavior and configuration belong to the consuming app; package
  defaults and integration code belong here.
- Check existing code and tests before adding abstractions or dependencies.
- Ask the user before editing any other package under `vendor/`.

## PHP and testing

- PHP compatibility floor is `>=8.4.6`; use `declare(strict_types=1);` and
  follow `.php-cs-fixer.dist.php`.
- Keep public API changes deliberate and backward compatible.
- Add or update focused tests for behavior changes. Prefer isolated tests; when
  a test needs a booted host app or external service, state and configure that
  prerequisite explicitly.
- Run `composer test` for PHPUnit and `composer cs-check` for the package style
  check when relevant. Do not run database setup or reset commands without
  explicit authorization and a confirmed disposable target.

## Documentation

Keep this entry point concise and link to longer references. Update the
architecture documentation when package layout or host integration changes.
Use Markdown, neutral host-app terminology, and relative links for navigation.

# Unicorn package architecture

This document describes the `windwalker/unicorn` Composer package and its
integration with a consuming host application. Unicorn supplies reusable
features for Windwalker applications; it does not own the host's bootstrap,
routes outside the package, application modules, or environment configuration.
Mandatory structural rules are in
[`../instructions/architecture.instructions.md`](../instructions/architecture.instructions.md).

## Package layout

Composer maps `Unicorn\` to [`src/`](../../src/) and loads
[`src/bootstrap.php`](../../src/bootstrap.php). The package's main areas are:

- [`src/UnicornPackage.php`](../../src/UnicornPackage.php): package installer
  and service provider; registers services, renderer components, asset import
  maps, the `StateMachine` attribute, and console-only commands.
- `src/Attributes/`, `src/Enum/`, and `src/Workflow/`: state-machine
  attributes, state types, and workflow transitions.
- `src/Controller/`, `src/Repository/`, `src/Selector/`, and `src/Model/`:
  reusable CRUD, grid, repository-action, query-selection, and entity helpers.
- `src/Field/`, `src/Form/`, `src/Component/`, `src/Html/`, and `src/View/`:
  form fields/rendering, Edge components, HTML helpers, and view-model traits.
- `src/Storage/`, `src/Upload/`, `src/Aws/`, and `src/Flysystem/`: storage
  adapters and factories, file-upload services, and optional integrations.
- `src/Generator/`, `src/Command/`, and `src/Script/`: code generators,
  console commands, and frontend asset registration helpers.
- `src/Image/`, `src/Excel/`, `src/Listener/`, `src/Middleware/`, and
  `src/Utilities/`: image handling, importing, event listeners, middleware,
  and shared utilities.
- [`etc/`](../../etc/): package-provided host configuration modules, including
  Unicorn and storage defaults. These files are installed into a host app, so
  their host-facing configuration namespace is intentional.
- [`routes/`](../../routes/), [`views/`](../../views/),
  [`resources/`](../../resources/), and [`assets/`](../../assets/): shipped
  route definitions, templates, language/migration resources, and assets.
- [`tests/`](../../tests/): PHPUnit test support and host-app bootstrap
  examples. Add package behavior tests here; do not create them in a consuming
  app's test directory.

## Host application integration

The package declares `Unicorn\UnicornPackage` in
`extra.windwalker.packages` and autoloads its source through Composer.
`UnicornPackage::install()` uses Core's `PackageInstaller` to install the
package configuration, route definitions, and language files into the host
app. The host remains responsible for loading installed config and routes,
providing environment values, and booting the application.

When registered as a provider, `UnicornPackage` prepares shared services,
extends the renderer with package view paths when available, registers Edge
components and renderer aliases, merges asset import-map entries, and registers
the `StateMachine` class attribute. It adds generator and migration-related
commands only for a console client. Keep these integration points in the
package rather than coupling them to a particular host bootstrap.

`etc/unicorn.config.php` supplies listeners and upload profiles.
`etc/storage.config.php` registers `StorageProvider`, storage factories, and
upload event wiring. The configured storage may be local, S3, or Flysystem;
optional adapters and credentials must be provided by the host environment
when those integrations are used. Do not add credentials or machine-specific
settings to package defaults.

## Feature flow

### Forms and UI

Package fields, renderers, and Edge components are registered through the
package provider and exposed to host templates through the renderer
configuration. Bootstrap-oriented templates are under `views/`; shared
rendering and form behavior should reuse Windwalker Core and Form APIs.

### Storage and uploads

`StorageProvider` builds the configured storage services and
`FileUploadService` coordinates upload options, file handling, and upload
events. Storage adapters implement the package storage contract. Keep storage
selection and upload profiles configurable by the host; do not assume local
filesystem paths or a specific cloud provider.

### Generated application code

The generator subcommands create host-app code and are registered for console
applications. Generated output belongs to the consuming app, not Unicorn's
`src/`. Update templates and generation behavior in the package when changing
what generators produce.

## Testing and validation

`composer test` runs the PHPUnit suite configured by the package's
`phpunit.xml`; `composer cs-check` runs the configured PHP-CS-Fixer check.
`phpunit.app.dist.xml` is the package's app-backed test configuration and
`tests/bootstrap.app.php` accepts `WINDWALKER_TEST_APP_ROOT` to identify a host
app. A host app may provide its own PHPUnit configuration. Use the explicit
configuration that matches the test's bootstrap requirements rather than
assuming a fixed host path.

Keep ordinary tests independent of a full application where possible. Tests
that require a database, host configuration, or external service must declare
that prerequisite and use an explicitly disposable test target. Never run
database-reset or seeding workflows against data that must be preserved.

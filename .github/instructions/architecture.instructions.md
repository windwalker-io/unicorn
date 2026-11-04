# Architecture instructions

Mandatory rules for changes to Unicorn's package structure and host-app
integration. See [`../docs/architecture.md`](../docs/architecture.md) for
background and the package map.

## Placement and boundaries

- Put reusable package code under `src/` in the matching `Unicorn\` namespace
  and capability directory. Follow the existing grouping rather than creating
  a new top-level area without a clear need.
- Keep package integration and registration in `UnicornPackage`,
  `StorageProvider`, and the established service/configuration mechanisms.
- Keep host-specific bootstrap, routes, modules, credentials, and deployment
  configuration in the consuming app. Host apps can have any name and location.
- Treat `etc/` as package-provided host configuration: keep its established
  host-facing namespace and avoid embedding machine-specific values.
- Reuse Windwalker Core contracts and services instead of reimplementing
  framework capabilities.

## Extension points and compatibility

- Register new package services, renderer components, attributes, and console
  commands through the existing package/provider integration points.
- Keep optional integrations optional. Do not make AWS or Flysystem features a
  requirement for users who do not use those adapters.
- Preserve public class names, interfaces, configuration keys, route behavior,
  and generator output unless a deliberate compatible change is required.
- Update [`../docs/architecture.md`](../docs/architecture.md) when package
  layout or host integration changes.

## Tests

- Add focused package tests under `tests/`; prefer isolated behavior tests over
  booting a full host app.
- State the host-app, database, or external-service setup required by
  integration tests. Never run destructive database setup or reset commands
  without explicit authorization and a confirmed disposable target.

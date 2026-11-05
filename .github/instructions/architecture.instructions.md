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


## Container layers

- Request-scoped state (request, `AppContext`, `AppState`, anything derived
  from the request) must be registered at `AppLayer::REQUEST`; never store it
  in a runtime or app level service, since servers reuse those across requests.
- Use `providedIn()` / `canProvide()` to restrict a provider's layer, and the
  request bootable/releasable provider interfaces for per-request setup and
  cleanup.
- Resolve services through the container; do not read globals or
  `Runtime::getContainer()` inside request-scoped code when `AppContext` or
  injection is available.

## Paths and debug mode

- `WINDWALKER_*` constants (`WINDWALKER_ROOT`, `WINDWALKER_CACHE`,
  `WINDWALKER_TEMP`, `WINDWALKER_RESOURCES`, `WINDWALKER_DEBUG`, ...) are
  defined by and scoped to the host app's bootstrap; they are not part of
  Core's internal API.
- Inside `src/`, resolve filesystem paths through `PathResolver`
  (`$app->path('@root/...')` or inject `PathResolver`) instead of referencing
  `WINDWALKER_*` path constants directly.
- Inside `src/`, read debug mode via `ApplicationInterface::isDebug()`
  (`$app->isDebug()`) instead of reading `WINDWALKER_DEBUG` directly.
- Existing `WINDWALKER_*` usages in `src/` predate this rule; do not copy them
  as a pattern for new code, and prefer `PathResolver`/`isDebug()` when
  touching that code.
- When fixing an existing `WINDWALKER_*` usage: if `PathResolver` /
  `ApplicationInterface` can be injected or otherwise obtained correctly at
  that location, replace it directly. If the code runs in an isolated context
  where injection isn't possible (e.g. before the container/app exists, a
  static/global context, or a class outside the DI graph), do not guess a
  workaround — ask the user how to proceed.

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

# PHP-CS-Fixer and Git Hooks: Agent Notes

> Draft implementation notes for agents to adapt into a formal reusable skill.

## Purpose

Record the current PHP-CS-Fixer and pre-commit setup shared by the editable Unicorn, Core, and Luna package checkouts. Preserve these behaviors when updating the tooling or converting this note into a skill.

## Scope

This applies to the package repositories checked out under a host application's `vendor/` directory:

| Package | Checkout path |
| --- | --- |
| `windwalker/unicorn` | `vendor/windwalker/unicorn` |
| `windwalker/core` | `vendor/windwalker/core` |
| `lyrasoft/luna` | `vendor/lyrasoft/luna` |

Each package has its own Composer scripts, `bin/cs-fixer.php`, `bin/autoload.app.php`, and `.githooks/pre-commit`.

## Composer commands

The three `composer.json` files use the same style commands:

```json
"cs-check": "bin/cs-fixer.php check --diff",
"cs-fix": "bin/cs-fixer.php fix",
"prepare-hooks": "git config core.hooksPath .githooks",
"remove-hooks": "git config --local --unset core.hooksPath"
```

Use `composer cs-check` to check the package's configured Finder scope and `composer cs-fix` to fix it. Composer arguments can be forwarded to the wrapper, for example:

```bash
composer cs-check -- --path-mode=intersection src/SomeClass.php
composer cs-fix -- --path-mode=intersection src/SomeClass.php
```

Hook setup is manual. Run `composer prepare-hooks` from each package repository to set that repository's local `core.hooksPath`; use `composer remove-hooks` to unset it. Do not add `post-install-cmd` or `post-update-cmd` automation unless requested. Running Composer in the host application's root does not run scripts declared by its dependencies.

## Autoload helper

`bin/autoload.app.php` is an internal helper for package scripts and tests, not production application bootstrap code. It has a file-level `@internal` annotation and documents that production applications should load their own Composer autoloader directly.

The helper checks these locations in order:

1. The package's own `vendor/autoload.php`.
2. The host application's `vendor/autoload.php`, using `dirname(__DIR__, 4)` from the package's `src/` directory. This assumes the package checkout is at `vendor/{vendor}/{package}`.

It requires and returns the first existing autoloader's return value. If neither exists, it returns `null`. Keep this limited to those two locations; do not add an open-ended ancestor search.

## Fixer executable

`bin/cs-fixer.php` is executable and starts with `#!/usr/bin/env php`. It loads `bin/autoload.app.php`, checks that PHP-CS-Fixer's console application is available, changes to the package root so that the package's `.php-cs-fixer.dist.php` is used, forwards the command-line arguments to `PhpCsFixer\Console\Application`, and exits with the application's status code.

The executable itself does not search for `vendor/bin/php-cs-fixer`; autoload discovery is centralized in `bin/autoload.app.php`. Keep the wrapper executable (`+x`) in all three packages.

## Pre-commit behavior

Each package's executable `.githooks/pre-commit`:

- Reads staged, added/copied/modified/renamed PHP files only; exits successfully when there are none.
- Runs that package's `bin/cs-fixer.php fix` with its `.php-cs-fixer.dist.php`, cache disabled, and quiet output.
- Restages files only when they have no unstaged changes. If a staged file also has unstaged changes, it fixes the working file but leaves it unstaged and reports that fact.
- Fails the commit if the runner cannot run or PHP-CS-Fixer reports an error.

The hook delegates autoload resolution to `bin/cs-fixer.php`; do not duplicate vendor-path discovery in the shell hook. Keep the hook executable (`+x`).

## Notes for future skill authors

- Treat this file as an implementation snapshot, not as the formal skill itself.
- Keep paths and examples host-neutral; the same behavior is used by all three package repositories.
- Preserve staged-file filtering and the protection for partially staged files.
- Preserve the manual hook activation policy unless the user explicitly changes it.
- Update the relevant package files together when changing the shared behavior, and verify each package's wrapper and hook independently.

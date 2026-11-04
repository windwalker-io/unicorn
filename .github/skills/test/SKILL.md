---
name: test
description: Add, update, and run PHP tests with PHPUnit, including handling local scope settings and using coverage to find missing tests.
---

# Skill: test

## Purpose

Provide a repeatable workflow for adding, updating, and running PHPUnit tests. Writing conventions live in the
[shared testing instructions](../../instructions/test-common.instructions.md) and coverage rules in the
[coverage instructions](../../instructions/test-coverage.instructions.md); this skill covers the process.

## When to use

- adding or updating tests for new or changed behavior
- running a requested test scope and reporting the result
- the user asks to add missing tests or improve coverage

## Expected behavior

### Run tests

1. Identify the requested scope (a file, a suite, or the whole project).
2. The root `phpunit.xml` is the primary test configuration, but a user's local settings may disable test scopes such as
   database, service, or package suites.
3. If the requested scope is disabled, do not treat tests that were not run as passing. Use a temporary configuration
   based on `phpunit.dist.xml` and remove it when finished, or supply the needed settings through PHPUnit CLI options
   where available.
4. Preserve any pre-existing local `phpunit.xml`.

### Add missing tests with coverage

1. When a coverage driver is available, run coverage for the requested scope to identify uncovered lines and branches.
2. Add meaningful behavior assertions for those gaps, including edge cases and error paths.
3. Rerun the same coverage scope to confirm the improvement.
4. Do not chase percentages with assertion-free tests or new coverage exclusions.
5. If coverage cannot run, report the limitation rather than claiming the gaps are covered.

## Validation

- the requested scope was actually executed, not silently skipped
- any temporary configuration was removed and the local `phpunit.xml` is unchanged
- new tests assert behavior and follow the shared testing and coverage instructions
- coverage claims are backed by a rerun of the same scope

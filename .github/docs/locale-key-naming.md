# Locale key naming conventions

> **Mandatory.** Read this document before adding, renaming, or reusing any
> translation key (`resources/languages/**/*.ini`, PHP `trans()`, frontend
> `__()`). It is the standard naming strategy for all locale keys. Do not
> invent a different structure.

Related rules: [`../instructions/i18n.instructions.md`](../instructions/i18n.instructions.md).

## Flat INI format

Unicorn language files are flat `.ini` files. There is no nesting: the
hierarchy is written as dot-separated segments in one key, and the value is
always double-quoted.

```ini
unicorn.message.delete.confirm="Are you sure you want to delete?"
unicorn.field.created.by="Created By"
```

Because every key is normalized (any character outside `A-Za-z0-9` becomes `.`,
then lowercased), **a word separator is also a dot**. `visibility_score`,
`visibility-score`, and `visibility.score` are the same key. Write multi-word
names with dots (`unicorn.field.created.by`, `unicorn.prompt.list.action.add`).
Never rely on `_`, `-`, or case to distinguish two keys.

A key may be both a leaf and a prefix of other keys
(`unicorn.field.created` and `unicorn.field.created.by`), which YAML nesting
cannot express. Prefer the explicit `.label` form (below) when a term has
derived keys.

Keep related keys adjacent and sorted by key so translators see a group
together.

## Namespace and scope

Keys start with a top-level, domain-based namespace. In this package it is
always `unicorn.`; a host application uses its own domain namespaces such as
`app.*`, `ui.*`, `form.*`, `project.*`, `geo.*`.

Within a namespace, a section groups keys by feature or page. Each namespace and
section forms a **scope**, and inside a scope keys are grouped by purpose:
`message.*`, `text.*`, `field.*`, `button.*`, `action.*`, `meta.*`.

```ini
; app scope
app.message.loading="Loading..."
app.message.error="An error occurred."
app.action.save="Save"
app.action.cancel="Cancel"

; geo.vistracker scope
geo.vistracker.message.loading="Loading visibility data..."
geo.vistracker.message.error="Failed to load visibility data."
geo.vistracker.field.visibility.score.label="Visibility Score"
geo.vistracker.field.visibility.score.desc="The overall visibility score for the selected keywords."

; geo.prompt.list scope
geo.prompt.list.message.loading="Loading prompts..."
geo.prompt.list.message.error="Failed to load prompts."
geo.prompt.list.action.add.prompt="Add Prompt"
```

Any level can be its own scope, but use **at most three levels** before the
purpose section:

1. **Namespace**: the broadest scope, by domain.
2. **Page / feature**: an intermediate scope for one page or feature.
3. **Shared layout**: a large layout or component reused by several pages that
   provides a complete page-level feature.

## Shared terms (columns, fields, table headers, metrics)

An important term can appear in charts, tables, reports, icons, buttons,
tooltips, and descriptions. Define it **once** under the namespace's `field.*`
and reuse it everywhere. The main text goes in `field.<term>.label`; any
description or tooltip goes in `field.<term>.desc`.

Bad (one key per component):

```ini
geo.metric.sov="Share of Voice"
geo.metric.sov.desc="..."
geo.table.header.sov="Share of Voice"
geo.charts.tooltip.sov="Share of Voice"
geo.charts.tooltip.sov.desc="..."
geo.input.sov.label="Share of Voice"
```

Good:

```ini
geo.field.sov.label="Share of Voice"
geo.field.sov.desc="Description of Share of Voice..."
geo.field.sov.any.other.usage="..."

; shared UI controls may use a component-specific namespace
ui.table.header.toggle.all="Toggle All"
```

## Purpose sections

Group by purpose, not by component. A per-component section makes the hierarchy
too deep and fragmented.

| Section | Use for |
|---------|---------|
| `meta.*` | page title, layout header, metadata, description, subtitle, breadcrumbs, other page/layout-level text |
| `message.*` | alerts, messages, toasts, notifications |
| `text.*` | notes, help text, hints, yes/no, other standalone text |
| `button.*` | button labels; may hold several states (text, tooltip, loading) |
| `action.*` | common action labels (save, cancel, submit) |
| `field.*` | form field labels, descriptions, placeholders, validation messages |

Reuse examples:

- Table headers, lists, cards, tooltips reuse `text.*`, `field.*`, or `message.*`.
- Common controls (toggle all, select all, clear all, reset all) reuse
  `app.*` / `ui.*` (in this package, `unicorn.core.*`).
- Form labels, table headers, and chart labels reuse `field.*`.
- Instructions, warnings, hints, and status messages use `message.*` or
  `text.*`; standalone text that fits nowhere else goes in `text.*`.

## Deriving keys

When one primary name needs several derived strings, append the derived suffix
to the primary key. A form field typically needs a label, description,
placeholder, and errors:

```ini
project.settings.field.title.label="Project Title"
project.settings.field.title.description="The title of the project"
project.settings.field.title.placeholder="Enter project title"
project.settings.field.title.error.required="Project title is required"
project.settings.field.title.error.invalid="Project title is invalid"
```

The shared prefix identifies the group and lets translators find related keys
quickly. Use the suffix names `label`, `desc` (or `description`),
`placeholder`, `error.*` consistently within a scope; do not mix `desc` and
`description` for the same purpose.

## Variants and abbreviations

Terms with long forms, abbreviations, or variants live under the same
`field.*` key:

```ini
geo.field.sov.label="Share of Voice"
geo.field.sov.abbr="SoV"
geo.field.aer.sov.label="AI Share of Voice"
geo.field.aer.sov.abbr="AI SoV"
geo.field.aer.sov.full="AI Engine Response Share of Voice"
```

## Name by meaning and component context

The same English word can mean different things. `Mentions` may be a mentioned
count in one chart, mentioned times in another, a form field, or mentioned
entities in a list. `Cited` may be "has cited" or "cited count". A noun like
`Music` has no English plural, but other languages do, so a plural key
(`music.list`) must be extracted.

Before extracting a noun, check the component and surrounding code:

- **Table header**: the data shown in the cell / `td` for the column.
- **Chart**: the purpose of the tooltip, legend, and axis.
- **Form**: the expected label, placeholder, and description of the field.
- **Title**: singular/plural form and context of the page, section, or API
  documentation it presents.

Do not reuse a key just because the English text is identical; reuse it only
when the **meaning and context** match. Follow surrounding comments or
explanatory text when present. For genuine plural forms use `choice()` (see
`plurals.md` of the Windwalker Language docs).

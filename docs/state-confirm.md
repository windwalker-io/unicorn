> Draft: to be merged into the official docs.

## Confirm Before Changing State

`<x-state-dropdown>` and `<x-state-button>` can ask the user for confirmation before a state or transition is
applied. The workflow only marks which states or transitions are *dangerous*; the page decides whether and how to
warn, so the same workflow can behave differently on different pages.

### Marking Dangerous States and Transitions

`State`, `Transition` and `StateOption` all provide `dangerous()` and `isDangerous()`. The flag is only a semantic
marker. It does not change behavior by itself and does not add any CSS class.

```php
$workflow = new WorkflowController('status');

$workflow->addState('published')->title('Published');
$workflow->addState('deleted')->title('Deleted')->dangerous();

$workflow->addTransition('delete', 'published', 'deleted')
    ->title('Delete')
    ->dangerous();
```

`WorkflowController::getStateButton()` carries the flag from each `State` to its `StateOption`.

### Enabling Confirmation in the View

Both components accept a `confirm` prop and an optional `confirmMessage` prop (the default message, `Are you sure?`).

```blade
{{-- Warn on dangerous items only, with the default message --}}
<x-state-dropdown :workflow="$workflow" :value="$item->state" :id="$item->id" :confirm="true" />

{{-- Warn on dangerous items only, with a custom message --}}
<x-state-dropdown :workflow="$workflow" :value="$item->state" :id="$item->id" confirm="This cannot be undone." />

{{-- Change the default message --}}
<x-state-dropdown :workflow="$workflow" :value="$item->state" :id="$item->id" :confirm="true" confirm-message="Really?" />
```

| `confirm` value            | Behavior                                                      |
|----------------------------|---------------------------------------------------------------|
| `null` / `false` (default) | No confirmation.                                              |
| `true`                     | Default message, for dangerous items only.                    |
| `string`                   | That message, for dangerous items only.                       |
| `array`                    | Per-item control, see below. The dangerous flag is ignored.   |
| `Closure`                  | Per-item control, see below. The dangerous flag is ignored.   |

#### Per-item control

An array is keyed by **transition name** (default mode) or **state value** (`use-states` mode, and the state list in
`batch` mode). Each value is a message, `true` for the default message, or `false` for no confirmation. Items that
are not listed are not confirmed.

```blade
<x-state-dropdown
    :workflow="$workflow"
    :value="$item->state"
    :id="$item->id"
    :confirm="['unpublish' => 'Unpublish this article?', 'delete' => true]"
/>
```

A closure receives the `Transition`, `State`/`StateOption` item and its key, and returns a message, `true` or `null`.
This lets the page decide based on the current user or data.

```blade
<x-state-dropdown
    :workflow="$workflow"
    :value="$item->state"
    :id="$item->id"
    :confirm="fn ($item, string $key) => $item->isDangerous() && !$isAdmin ? 'Ask an admin first.' : null"
/>
```

### Behaviors and Limitations

- The confirmation is a browser `confirm()` call placed in front of the existing action. Cancelling it stops the
  request.
- `<x-state-dropdown>` supports the normal, `use-states` and `batch` modes.
- A custom `onclick` on `<x-state-dropdown>` takes full control and `confirm` is not applied. Call `confirm()`
  yourself inside it if needed.
- `<x-state-button>` applies `confirm` to `task` clicks only; `onclick` and `href` actions are not affected. For a
  button, the key of an array or closure is the current state value.
- Dangerous items are not styled automatically. Add your own classes if you want them highlighted.

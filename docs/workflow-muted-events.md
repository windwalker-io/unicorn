> Draft: to be merged into the official docs.

## Muting Workflow Events While Seeding or Migrating

Workflow listeners often have external side effects, such as sending mail or calling an API. A seeder or a migration
can trigger many transitions in a row, which would cause a flood of those side effects. To prevent this, workflow
events are **muted automatically** while a seeder or a migration is running. Developers do not need to remember to
turn anything off.

### How It Works

`SeedService::$running` and `MigrationService::$running` are static flags that are `true` while a seeder
(import or clear) or a migration handler is executing. `WorkflowController::isMuted()` returns `true` when either
flag is set.

While muted:

- Regular listeners are **skipped**. These are listeners registered with `onBeforeChanged()`, `onAfterChanged()`,
  `onBeforeTransition()`, `onAfterTransition()`, `onBeforeFrom()`, `onAfterFrom()`, `onBeforeTo()` and `onAfterTo()`.
- `Always` listeners **still run**.
- Transition validation (`isAllow()`) is **not** affected. Disallowed transitions still throw
  `TransitionDisallowException`.

### Registering Listeners

Put anything with external side effects in a regular listener, and anything that must always run (logging, keeping
internal data consistent) in an `Always` listener:

```php
$workflow->onAfterTransition('publish', function (TransitionEvent $event) {
    // Sends mail: skipped while seeding or migrating
    $mailer->send(...);
});

$workflow->onAfterTransitionAlways('publish', function (TransitionEvent $event) {
    // Always runs
    $logger->info('Article published');
});
```

Available `Always` methods:

| Method                                            | Regular equivalent    |
|---------------------------------------------------|-----------------------|
| `onBeforeChangedAlways($froms, $tos, $listener)`  | `onBeforeChanged()`   |
| `onAfterChangedAlways($froms, $tos, $listener)`   | `onAfterChanged()`    |
| `onBeforeTransitionAlways($name, $listener)`      | `onBeforeTransition()`|
| `onAfterTransitionAlways($name, $listener)`       | `onAfterTransition()` |

`onBeforeFrom()`, `onAfterFrom()`, `onBeforeTo()`, `onAfterTo()` and the methods above also accept a trailing
`bool $always = false` argument if you prefer to pass it explicitly.

### Checking the Muted State in a Listener

`TransitionEvent` has a `$muted` property, set when the event is created. An `Always` listener can use it to decide
what to do:

```php
$workflow->onAfterChangedAlways('draft', 'published', function (TransitionEvent $event) {
    $logger->info('Published', ['seeding' => $event->muted]);

    if (!$event->muted) {
        $cache->clear();
    }
});
```

### Notes

- The flags are static and restored with `try/finally`, so nested runs are handled correctly.
- Only seeders and migrations run through `SeedService` / `MigrationService` set the flags. Other batch jobs are not
  muted automatically; use `Always` and regular listeners deliberately there.

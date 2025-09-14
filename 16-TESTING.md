# DevOS — Testing Strategy

## Testing Levels

### Unit

Test:

- utilities
- validation
- transformations
- business rules

### Component

Test:

- forms
- buttons
- empty states
- error states
- important interactive components

### API

Test:

- authentication
- authorization
- CRUD
- validation
- failure cases

### Integration

Test important flows:

```text
register → login → create project → create task
```

and:

```text
connect GitHub → sync → view activity
```

## What Not to Test

Do not write brittle tests for every implementation detail.

Prefer behavior.

Bad:

```text
expect internal function X to be called
```

Better:

```text
expect user-visible result
```

## Required Cases

Every major feature should test:

- success
- validation failure
- empty data
- unauthorized access
- server error where practical

## CI

Pull requests should run:

```text
lint
typecheck
test
build
```

Do not merge known failing CI without an explicit reason.

# DevOS — Code Quality Rules

## TypeScript

Use strict TypeScript.

Avoid `any` unless there is a documented unavoidable boundary.

Prefer explicit domain types.

## Components

Components should have one clear responsibility.

Avoid giant components containing:

- fetching
- business logic
- forms
- charts
- navigation
- API calls

Extract domain logic into hooks/services.

## Naming

Use descriptive names.

Bad:

```text
DataBox
Thing
handleIt
temp
```

Better:

```text
ProjectProgress
GitHubActivityChart
handleProjectCreate
```

## Duplication

Do not duplicate business logic.

But do not over-abstract two components that merely look similar.

## Dead Code

Remove:

- unused imports
- unused components
- unreachable branches
- obsolete hooks
- abandoned experiments
- commented-out old implementations

Do not leave large commented code blocks.

## API Logic

Never put raw fetch/API calls throughout UI components.

Centralize service access.

## Styling

Use the shared design system.

No random per-component CSS.

## Error Handling

Never silently swallow errors.

Handle them intentionally.

## Documentation

Document non-obvious decisions.

Do not document obvious code with excessive comments.

## Refactoring

Refactor when complexity creates a real maintenance problem.

Do not rewrite working code purely for aesthetic reasons.

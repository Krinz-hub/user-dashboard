# DevOS — State Management

## Server State

Use TanStack Query for:

- projects
- tasks
- GitHub data
- analytics
- dashboard data

Benefits:

- caching
- refetching
- loading states
- mutation handling

## Client State

Use lightweight local state for:

- dialogs
- filters
- navigation
- temporary UI state

Use a global store only when state genuinely needs to cross distant component boundaries.

## URL State

Put shareable/filterable state in the URL where useful:

- search
- project filters
- analytics range
- selected tabs

## Forms

Use React Hook Form + Zod.

## Cache Invalidation

After mutations, invalidate or update the smallest relevant query.

Do not refetch the entire application after every change.

## Optimistic Updates

Use only when:

- operation is predictable
- rollback is straightforward
- UX meaningfully improves

Do not use optimistic updates everywhere.

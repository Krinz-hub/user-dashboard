# DevOS — Performance

## General

Performance should be measured before optimizing.

## Frontend

Use:

- lazy routes
- TanStack Query caching
- selective rendering
- debounced search
- pagination
- responsive image handling

## Dashboard

The dashboard should request summarized data.

Avoid:

```text
load every task
+
load every commit
+
load every repository
+
load every analytics record
```

in one request.

## Backend

Avoid unnecessary database queries.

Use indexes.

Use projections when full documents are unnecessary.

## GitHub

Cache synchronized data.

Respect external rate limits.

## Charts

Do not render thousands of points if the screen cannot meaningfully display them.

Aggregate data for long time ranges.

## Bundle

Inspect bundle size periodically.

Do not add large dependencies for small functionality.

## Performance Budget

Treat noticeable:

- input lag
- layout shift
- slow navigation
- unnecessary network requests

as bugs worth investigating.

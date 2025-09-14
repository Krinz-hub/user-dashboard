# DevOS — UI State Specification

Every data-driven feature must support four states.

## Loading

Use lightweight skeletons or progress indicators.

Do not show a blank page.

## Empty

Explain what is missing and provide the next useful action.

Example:

```text
No projects yet.

[Create project]
```

## Error

Explain the problem in plain language.

Example:

```text
Couldn't load your projects.

[Try again]
```

Do not expose:

```text
AxiosError 500
MongoServerError...
```

## Success

Keep confirmation brief.

Examples:

```text
Project created
Task completed
GitHub synced
Changes saved
```

## Network Failure

The application should remain understandable when the network is unavailable.

## GitHub Failure

Provide:

- short explanation
- retry
- connection guidance if authentication expired

## AI Failure

AI failure should be isolated.

Example:

```text
AI planning is temporarily unavailable.

You can create the plan manually.
```

The core application must continue working.

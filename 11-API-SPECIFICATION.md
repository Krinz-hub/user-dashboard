# DevOS — API Specification

## Base

```text
/api
```

## Auth

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

## Projects

```text
GET    /projects
POST   /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
```

## Tasks

```text
GET    /tasks
POST   /tasks
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id
```

## Goals

```text
GET   /goals
POST  /goals
PATCH /goals/:id
```

## Dashboard

```text
GET /dashboard
```

Return only data needed by the dashboard.

## GitHub

```text
GET /github/profile
GET /github/repos
GET /github/activity
GET /github/stats
POST /github/sync
DELETE /github/connection
```

## Analytics

```text
GET /analytics?range=7d
GET /analytics?range=30d
GET /analytics?range=90d
GET /analytics?range=1y
```

## Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project not found"
  }
}
```

## Validation

Validate:

- params
- query strings
- request bodies

Use Zod or an equivalent schema layer.

## Pagination

Collection endpoints should support pagination where datasets can grow.

Example:

```text
?page=1&limit=20
```

## Security

All private endpoints require authentication.

Authorization must happen server-side.

## Logging

Do not log:

- passwords
- access tokens
- refresh tokens
- OAuth secrets
- AI API keys

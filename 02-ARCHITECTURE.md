# DevOS — Architecture

## Architecture Style

Use a modular monorepo with separate web and API applications.

```text
devos/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── types/
│   ├── config/
│   └── ui/
├── docs/
├── scripts/
└── .github/
```

## Frontend

Use feature-oriented organization:

```text
apps/web/src/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── projects/
│   ├── tasks/
│   ├── github/
│   ├── goals/
│   ├── focus/
│   ├── analytics/
│   └── ai/
├── layouts/
├── hooks/
├── lib/
├── services/
├── stores/
├── types/
└── main.tsx
```

## Backend

```text
apps/api/src/
├── config/
├── controllers/
├── middleware/
├── models/
├── repositories/
├── routes/
├── services/
├── validators/
├── utils/
└── server.ts
```

## Request Flow

```text
UI
 ↓
TanStack Query / feature service
 ↓
REST API
 ↓
Controller
 ↓
Validator
 ↓
Service
 ↓
Repository / External Service
 ↓
Database / GitHub
```

Controllers should remain thin.

Business logic belongs in services.

Database access belongs in repositories/models.

## External Integrations

Use adapters:

```text
services/integrations/
├── github/
└── ai/
```

Do not couple UI components directly to GitHub or AI APIs.

## Error Boundary

Frontend should have route-level and application-level error boundaries.

Backend should use centralized error middleware.

## Scalability

Do not prematurely introduce microservices.

A modular monolith is the default architecture.

Move expensive jobs to background workers only when required.

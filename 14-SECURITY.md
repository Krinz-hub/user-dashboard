# DevOS — Security Requirements

## Secrets

All secrets belong in environment variables.

Never commit:

- API keys
- OAuth secrets
- database credentials
- JWT secrets
- tokens

## Authentication

Use secure password hashing and token handling.

## Authorization

Every private resource must verify ownership.

Example:

```text
Authenticated user
+
Requested project belongs to authenticated user
=
Allowed
```

## Validation

Validate all external input.

Never trust:

- URL params
- query params
- request bodies
- OAuth callback values

## Rate Limiting

Apply rate limits to:

- login
- registration
- password-related endpoints
- AI endpoints
- expensive synchronization endpoints

## CORS

Allow only expected origins.

Do not use unrestricted CORS in production.

## Security Headers

Use appropriate HTTP security headers.

## Error Messages

Do not expose stack traces or internal implementation details in production.

## GitHub

Protect OAuth credentials.

Store only the minimum required token information.

## AI

Protect provider API keys server-side.

Do not expose them through frontend bundles.

## Dependency Security

Regularly inspect dependencies for known vulnerabilities.

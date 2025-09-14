# DevOS — Authentication

## Registration

Fields:

- name
- email
- password
- confirm password

Validate client-side and server-side.

## Login

Fields:

- email
- password

Provide:

- loading state
- invalid credentials state
- network error state

## Session

Use secure token handling.

Prefer short-lived access tokens and secure refresh-token handling.

Never store secrets in localStorage when a safer architecture is available.

## Authorization

Every protected resource must verify ownership server-side.

Never trust a user ID supplied by the client.

## Password Security

Use a modern password hashing algorithm.

Never log passwords.

Never return password hashes through API responses.

## Logout

Invalidate the refresh session where applicable.

Clear client-side cached private data.

## Protected Routes

Frontend protection improves UX, but backend authorization is mandatory.

## Security Checks

Verify:

- authentication
- authorization
- input validation
- rate limiting
- CORS
- token expiry
- secret management

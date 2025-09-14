# DevOS — Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Lucide React

## Backend

- Node.js
- Express
- TypeScript
- Mongoose
- Zod
- bcrypt/argon2
- JSON Web Tokens

## Database

MongoDB.

Use indexes for:

- user ownership
- project ownership
- task project/status
- activity timestamp
- GitHub repository identifiers

## Testing

Frontend:

- Vitest
- React Testing Library

Backend:

- Vitest
- Supertest

## Quality

- ESLint
- Prettier
- Husky
- lint-staged

## CI

GitHub Actions should run:

1. install
2. typecheck
3. lint
4. tests
5. build

## Deployment

Initial deployment can use:

- Vercel for web
- Render/Railway for API
- MongoDB Atlas for database

Keep deployment-specific assumptions isolated.

## Dependency Rules

Before adding a package, ask:

- Is native functionality sufficient?
- Does an existing dependency already solve this?
- Is the package maintained?
- Does it materially reduce complexity?

Do not install packages for trivial functionality.

# DevOS — Personal Developer Operating System

> A calm, minimal workspace for tracking projects, tasks, goals, GitHub activity, focus sessions, and useful AI assistance.

DevOS is designed to quickly and clearly answer three primary questions:
1. **What am I working on?**
2. **How is it going?**
3. **What should I do next?**

---

## Architecture & Tech Stack

DevOS is built as a modular monorepo using npm workspaces:

- **Frontend (`apps/web`)**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod, Lucide React, and Recharts.
- **Backend (`apps/api`)**: Node.js, Express, TypeScript, Mongoose, Zod, JWT, bcryptjs, Helmet, and Rate Limiting.
- **Database**: MongoDB (with zero-config in-memory fallback for local development).
- **Testing**: Vitest & Supertest.

```text
devos/
├── apps/
│   ├── api/                 # Express + TypeScript + Mongoose + Zod
│   └── web/                 # React 18 + Vite + Tailwind CSS
├── docs/                    # Architectural guides & product contracts
├── .github/workflows/       # GitHub Actions CI pipeline
├── Dockerfile               # Production multi-stage container
└── docker-compose.yml       # Local container orchestration with MongoDB
```

---

## Quick Start

### 1. Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### 2. Installation
```bash
git clone <repo-url>
cd devos
npm install
```

### 3. Running Locally
Start both backend API and frontend client concurrently:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:5001](http://localhost:5001)
- **API Health Check**: [http://localhost:5001/health](http://localhost:5001/health)

---

## Development Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts API (`:5001`) and Web (`:3000`) in watch mode |
| `npm run build` | Builds production bundles for all workspaces |
| `npm run typecheck` | Runs strict TypeScript checks across all workspaces |
| `npm run test` | Executes the automated Vitest test suite |

---

## Design System & Principles

- **Minimal by Default**: Shows only decision-useful information; avoids decorative widgets or wall-to-wall cards.
- **Centralized Design Tokens**: Defined in `apps/web/src/index.css` and `tailwind.config.js` with semantic CSS variables for dark and light themes. Zero component-level style leaks.
- **Responsive Navigation**: Full responsive support across all 8 breakpoints (`320px` to `1920px`) with mobile sticky navigation and slide-up drawer.

---

## License

MIT

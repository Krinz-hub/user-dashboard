# DevOS — Personal Developer Operating System

<div align="center">

![DevOS Logo](https://img.shields.io/badge/DevOS-0.1.0-blue?style=for-the-badge&logo=terminal)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A calm, minimal developer command center for active projects, tasks, goals, GitHub metrics, focus blocks, and intentional AI assistance.**

[Quickstart](#-quickstart) • [Architecture](#-architecture) • [API Guide](docs/API-REFERENCE.md) • [Setup Guide](docs/SETUP-GUIDE.md) • [Features](#-features)

</div>

---

## 💡 What is DevOS?

Most developer workspaces are noisy analytics dumps or bloated issue trackers. **DevOS** was built from first principles to answer three essential questions within seconds of opening:

1. **What am I working on right now?**
2. **How is it going?**
3. **What is my next meaningful action?**

---

## 🏛 Architecture

DevOS is structured as a high-performance **modular monorepo** with npm workspaces:

```text
devos/
├── apps/
│   ├── api/                 # Node.js + Express + TypeScript + Mongoose + Zod
│   │   ├── src/controllers/ # Thin HTTP handlers
│   │   ├── src/services/    # Domain business logic & external adapters
│   │   ├── src/models/      # MongoDB Mongoose schemas with ownership scoping
│   │   └── src/middleware/  # JWT auth, rate limiting, and error handling
│   │
│   └── web/                 # React 18 + Vite + Tailwind CSS + TanStack Query
│       ├── src/components/  # Shared design primitives (Button, Card, Dialog, Badge)
│       ├── src/features/    # Vertical feature slices (Dashboard, Projects, Tasks...)
│       └── src/index.css    # Central semantic HSL design tokens
│
├── docs/                    # Architectural contracts and specifications
├── Dockerfile               # Multi-stage production container
└── docker-compose.yml       # Production-ready compose configuration
```

---

## 🚀 Quickstart

### 1. Installation
Clone the repository and install all monorepo packages:
```bash
git clone https://github.com/Krinz-hub/user-dashboard.git
cd user-dashboard
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Launch Development Workspace
Start both backend API and frontend client concurrently with one command:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **REST API Server**: [http://localhost:5001](http://localhost:5001)
- **Health Check**: [http://localhost:5001/health](http://localhost:5001/health)

---

## 🛠 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Runs Web (`:3000`) and API (`:5001`) concurrently with hot-reloading |
| `npm run dev:web` | Runs the Vite frontend development server only |
| `npm run dev:api` | Runs the Express API server with `tsx watch` |
| `npm run build` | Builds optimized production bundles across all packages |
| `npm run typecheck` | Executes strict TypeScript checks (`tsc --noEmit`) |
| `npm run test` | Executes the Vitest test suite (18/18 tests passing) |

---

## ✨ Features

- **Overview Dashboard**: Prioritizes current focus, exactly 4 key metrics, active projects, and upcoming actions.
- **Project Tracking**: Milestone progress bars, status workflows, and tech stack tags.
- **Kanban Board & List View**: Fast inline task management (`Backlog`, `Todo`, `In Progress`, `Done`).
- **GitHub Telemetry**: Commit streaks, repository sync, and language breakdown with rate-limit protection.
- **Distraction-Free Focus Mode**: Integrated digital Pomodoro timer with deep-work session logs.
- **Developer Analytics**: Work cadence velocity and project attention distribution using Recharts.
- **AI Planning Layer**: Project breakdown and automated weekly retrospectives.
- **Responsive Navigation**: Full responsive layout from 320px mobile to 1920px ultrawide displays.

---

## 📚 Documentation

- [Detailed Setup Guide](docs/SETUP-GUIDE.md)
- [REST API Reference](docs/API-REFERENCE.md)
- [Product Specifications](docs/01-PRODUCT-REQUIREMENTS.md)
- [Design System Guide](docs/04-DESIGN-SYSTEM.md)
- [Responsive Specification](docs/06-RESPONSIVE-SPECIFICATION.md)

---

## 📄 License

MIT © DevOS Contributors

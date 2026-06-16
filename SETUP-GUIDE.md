# DevOS — Developer Setup & Environment Guide

This guide provides step-by-step instructions for configuring, running, and developing DevOS across local and containerized environments.

---

## 1. Prerequisites

Ensure your development machine meets the minimum runtime requirements:

| Tool | Minimum Version | Recommended | Notes |
|---|---|---|---|
| **Node.js** | `v20.0.0` | `v20.18.0` LTS | Check with `node -v` |
| **npm** | `v10.0.0` | `v10.8.0`+ | Built-in with Node.js |
| **Git** | `v2.40.0` | Latest | For version control |
| **MongoDB** | `v7.0` | MongoDB Atlas or Local | *Optional: Fallback in-memory store provided* |

---

## 2. Quickstart Installation

Clone the repository and install all monorepo dependencies in one step:

```bash
# Clone the repository
git clone https://github.com/Krinz-hub/user-dashboard.git
cd user-dashboard

# Install all workspace dependencies
npm install
```

---

## 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

### Environment Variables Glossary

```bash
# Node environment mode
NODE_ENV=development

# API port (default: 5001 to avoid macOS AirPlay Receiver collision on 5000)
PORT=5001

# Client application origin for CORS validation
CLIENT_URL=http://localhost:3000

# MongoDB connection string
MONGODB_URI=mongodb://127.0.0.1:27017/devos

# JWT Secret for session authentication
JWT_SECRET=your-secure-random-secret-key
JWT_EXPIRES_IN=7d

# Optional: GitHub OAuth credentials
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Optional: AI Provider API Key
AI_API_KEY=
```

> **Note:** If `MONGODB_URI` is unreachable or local MongoDB is not running, DevOS automatically operates in zero-config development fallback mode without crashing.

---

## 4. Running DevOS Locally

### Starting Both Servers (Recommended)
```bash
npm run dev
```
This runs `concurrently`:
- **Frontend Client (`@devos/web`)**: [http://localhost:3000](http://localhost:3000)
- **Backend API (`@devos/api`)**: [http://localhost:5001](http://localhost:5001)

### Starting Services Individually
```bash
# Run backend API only
npm run dev:api

# Run frontend client only
npm run dev:web
```

---

## 5. Verification & Testing

Verify that all type definitions and test suites pass:

```bash
# Run strict TypeScript check across all packages
npm run typecheck

# Run automated Vitest test suite
npm run test

# Run production build
npm run build
```

---

## 6. Docker Deployment

DevOS includes a multi-stage production container setup:

```bash
# Build and run DevOS with MongoDB via docker-compose
docker-compose up -d --build

# View container logs
docker-compose logs -f devos
```

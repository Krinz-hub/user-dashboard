# DevOS — REST API Reference & Specification

Base URL: `http://localhost:5001/api`

All private endpoints require a Bearer token in the `Authorization` header:
```text
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### Register
`POST /auth/register`
```json
// Request Body
{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "password": "securePassword123"
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Developer",
      "email": "jane@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login
`POST /auth/login`
```json
// Request Body
{
  "email": "developer@devos.local",
  "password": "password"
}
```

### Get Current User Profile
`GET /auth/me`

---

## 2. Projects Endpoints

### List Projects
`GET /projects?status=Building`

### Create Project
`POST /projects`
```json
// Request Body
{
  "name": "DevOS Workspace",
  "description": "Personal developer operating system",
  "status": "Building",
  "progress": 75,
  "repository": "https://github.com/org/repo",
  "technologies": ["React", "TypeScript", "Node.js", "Tailwind"]
}
```

### Get / Update / Delete Project
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id` (Soft-archives project)

---

## 3. Tasks Endpoints

### List Tasks
`GET /tasks?projectId=:projectId&status=Todo`

### Create Task
`POST /tasks`
```json
// Request Body
{
  "title": "Implement cache invalidation logic",
  "description": "Support optimistic UI updates with query client rollback",
  "status": "Todo",
  "priority": "High",
  "labels": ["backend", "performance"]
}
```

---

## 4. Dashboard & Analytics

### Aggregated Dashboard Metrics
`GET /dashboard`
Returns 4 key metrics, current focus card, active projects, upcoming tasks, and recent activity.

### Velocity Trends
`GET /analytics?range=30d` (Options: `7d`, `30d`, `90d`, `1y`)

---

## 5. Focus & AI Layer

### Start Focus Block
`POST /focus`
```json
{
  "duration": 25,
  "notes": "Refactoring token store"
}
```

### Project Planner Assistant
`POST /ai/plan`
```json
{
  "name": "Distributed Storage Engine",
  "description": "Block-level replication over gRPC"
}
```

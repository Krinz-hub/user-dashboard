import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from './server.js';

describe('DevOS API Verification Suite', () => {
  let authToken = '';

  describe('Health & Error Handling', () => {
    it('GET /health returns 200 ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('GET /api/non-existent returns 404 with structured error', async () => {
      const res = await request(app).get('/api/non-existent');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
    });
  });

  describe('Authentication Flow (P0)', () => {
    it('POST /api/auth/register validates and creates a user', async () => {
      const testEmail = `engineer_${Date.now()}@devos.local`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Engineer',
          email: testEmail,
          password: 'superSecretPassword123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testEmail);
      authToken = res.body.data.token;
    });

    it('POST /api/auth/login validates credentials and returns token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'developer@devos.local',
          password: 'anyPasswordForMock',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('GET /api/auth/me rejects request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('GET /api/auth/me returns profile with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
    });
  });

  describe('Projects & Tasks CRUD & Ownership (P0)', () => {
    let createdProjectId = '';

    it('POST /api/projects creates a new project with valid payload', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Quantum Compiler Toolchain',
          description: 'Optimizing quantum instruction sets for noisy intermediate-scale hardware',
          status: 'Building',
          progress: 35,
          technologies: ['Rust', 'LLVM', 'QASM'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.project.name).toBe('Quantum Compiler Toolchain');
      createdProjectId = res.body.data.project._id;
    });

    it('GET /api/projects returns user projects', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.projects)).toBe(true);
    });

    it('POST /api/tasks creates task associated with project', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          projectId: createdProjectId,
          title: 'Implement Clifford gate synthesis pass',
          priority: 'High',
          status: 'Todo',
          labels: ['compiler', 'optimization'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.task.title).toBe('Implement Clifford gate synthesis pass');
    });
  });

  describe('Dashboard & Secondary Services (P0/P1)', () => {
    it('GET /api/dashboard returns 4 key metrics and current focus', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics.length).toBe(4);
      expect(res.body.data.focus).toBeDefined();
    });

    it('GET /api/github/stats returns repository analytics', async () => {
      const res = await request(app)
        .get('/api/github/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stats.totalCommits).toBeGreaterThan(0);
    });

    it('POST /api/ai/plan generates actionable steps', async () => {
      const res = await request(app)
        .post('/api/ai/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Distributed Lock Service',
          description: 'Raft consensus backed lock manager',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.plan.length).toBeGreaterThan(0);
    });
  });
});

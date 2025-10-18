import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import taskRoutes from './task.routes.js';
import {
  dashboardRouter,
  goalRouter,
  focusRouter,
  githubRouter,
  analyticsRouter,
  aiRouter,
} from './secondary.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRouter);
router.use('/goals', goalRouter);
router.use('/focus', focusRouter);
router.use('/github', githubRouter);
router.use('/analytics', analyticsRouter);
router.use('/ai', aiRouter);

export default router;

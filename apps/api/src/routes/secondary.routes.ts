import { Router } from 'express';
import {
  GoalController,
  FocusController,
  GitHubController,
  AnalyticsController,
  AIController,
} from '../controllers/secondary.controllers.js';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createGoalSchema, updateGoalSchema } from '../validators/goal.validator.js';
import { startFocusSessionSchema, updateFocusSessionSchema } from '../validators/focus.validator.js';
import { aiLimiter } from '../middleware/rateLimiter.middleware.js';

// Dashboard Router
export const dashboardRouter = Router();
dashboardRouter.use(authenticate);
dashboardRouter.get('/', DashboardController.getDashboard);

// Goals Router
export const goalRouter = Router();
goalRouter.use(authenticate);
goalRouter.get('/', GoalController.getGoals);
goalRouter.post('/', validate(createGoalSchema), GoalController.createGoal);
goalRouter.patch('/:id', validate(updateGoalSchema), GoalController.updateGoal);

// Focus Router
export const focusRouter = Router();
focusRouter.use(authenticate);
focusRouter.get('/', FocusController.getSessions);
focusRouter.post('/', validate(startFocusSessionSchema), FocusController.startSession);
focusRouter.patch('/:id', validate(updateFocusSessionSchema), FocusController.updateSession);

// GitHub Router
export const githubRouter = Router();
githubRouter.use(authenticate);
githubRouter.get('/profile', GitHubController.getProfile);
githubRouter.get('/repos', GitHubController.getRepos);
githubRouter.get('/stats', GitHubController.getStats);
githubRouter.post('/sync', GitHubController.sync);

// Analytics Router
export const analyticsRouter = Router();
analyticsRouter.use(authenticate);
analyticsRouter.get('/', AnalyticsController.getAnalytics);

// AI Router
export const aiRouter = Router();
aiRouter.use(authenticate, aiLimiter);
aiRouter.post('/plan', AIController.planProject);
aiRouter.post('/breakdown', AIController.breakdownTask);
aiRouter.get('/weekly-review', AIController.weeklyReview);

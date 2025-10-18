import { Request, Response, NextFunction } from 'express';
import { GoalService } from '../services/goal.service.js';
import { FocusService } from '../services/focus.service.js';
import { GitHubService } from '../services/integrations/github/github.service.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { AIService } from '../services/integrations/ai/ai.service.js';

export class GoalController {
  static async getGoals(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string | undefined;
      const goals = await GoalService.getGoals(req.user!.id, period);
      return res.json({ success: true, data: { goals } });
    } catch (err) {
      return next(err);
    }
  }

  static async createGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = await GoalService.createGoal(req.user!.id, req.body);
      return res.status(201).json({ success: true, data: { goal } });
    } catch (err) {
      return next(err);
    }
  }

  static async updateGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = await GoalService.updateGoal(req.user!.id, req.params.id, req.body);
      return res.json({ success: true, data: { goal } });
    } catch (err) {
      return next(err);
    }
  }
}

export class FocusController {
  static async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await FocusService.getSessions(req.user!.id);
      return res.json({ success: true, data: { sessions } });
    } catch (err) {
      return next(err);
    }
  }

  static async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await FocusService.startSession(req.user!.id, req.body);
      return res.status(201).json({ success: true, data: { session } });
    } catch (err) {
      return next(err);
    }
  }

  static async updateSession(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await FocusService.updateSession(req.user!.id, req.params.id, req.body);
      return res.json({ success: true, data: { session } });
    } catch (err) {
      return next(err);
    }
  }
}

export class GitHubController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await GitHubService.getProfile(req.user!.id, req.user?.githubToken);
      return res.json({ success: true, data: { profile } });
    } catch (err) {
      return next(err);
    }
  }

  static async getRepos(req: Request, res: Response, next: NextFunction) {
    try {
      const repos = await GitHubService.getRepos(req.user!.id, req.user?.githubToken);
      return res.json({ success: true, data: { repos } });
    } catch (err) {
      return next(err);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await GitHubService.getStats(req.user!.id);
      return res.json({ success: true, data: { stats } });
    } catch (err) {
      return next(err);
    }
  }

  static async sync(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GitHubService.sync(req.user!.id, req.user?.githubToken);
      return res.json({ success: true, data: result });
    } catch (err) {
      return next(err);
    }
  }
}

export class AnalyticsController {
  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const range = (req.query.range as string) || '30d';
      const analytics = await AnalyticsService.getAnalytics(req.user!.id, range);
      return res.json({ success: true, data: { analytics } });
    } catch (err) {
      return next(err);
    }
  }
}

export class AIController {
  static async planProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const plan = await AIService.planProject(name, description);
      return res.json({ success: true, data: { plan } });
    } catch (err) {
      return next(err);
    }
  }

  static async breakdownTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body;
      const breakdown = await AIService.breakdownTask(title);
      return res.json({ success: true, data: { breakdown } });
    } catch (err) {
      return next(err);
    }
  }

  static async weeklyReview(_req: Request, res: Response, next: NextFunction) {
    try {
      const report = await AIService.generateWeeklyReview();
      return res.json({ success: true, data: { report } });
    } catch (err) {
      return next(err);
    }
  }
}

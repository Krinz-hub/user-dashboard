import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

export class DashboardController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getDashboard(req.user!.id);
      return res.json({
        success: true,
        data,
      });
    } catch (err) {
      return next(err);
    }
  }
}

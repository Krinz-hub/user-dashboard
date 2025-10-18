import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';

export class TaskController {
  static async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.query.projectId as string | undefined;
      const status = req.query.status as string | undefined;
      const tasks = await TaskService.getTasks(req.user!.id, projectId, status);
      return res.json({
        success: true,
        data: { tasks },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.getTaskById(req.user!.id, req.params.id);
      return res.json({
        success: true,
        data: { task },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.createTask(req.user!.id, req.body);
      return res.status(201).json({
        success: true,
        data: { task },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.updateTask(req.user!.id, req.params.id, req.body);
      return res.json({
        success: true,
        data: { task },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TaskService.deleteTask(req.user!.id, req.params.id);
      return res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

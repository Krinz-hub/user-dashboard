import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service.js';

export class ProjectController {
  static async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const projects = await ProjectService.getProjects(req.user!.id, status);
      return res.json({
        success: true,
        data: { projects },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getProjectById(req.user!.id, req.params.id);
      return res.json({
        success: true,
        data: { project },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.user!.id, req.body);
      return res.status(201).json({
        success: true,
        data: { project },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.updateProject(req.user!.id, req.params.id, req.body);
      return res.json({
        success: true,
        data: { project },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProjectService.deleteProject(req.user!.id, req.params.id);
      return res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

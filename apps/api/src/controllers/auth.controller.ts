import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register(name, email, password);
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.id);
      return res.json({
        success: true,
        data: { user },
      });
    } catch (err) {
      return next(err);
    }
  }

  static async logout(_req: Request, res: Response) {
    return res.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  }
}

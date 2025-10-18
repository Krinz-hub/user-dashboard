import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from './error.middleware.js';
import { isDbConnected } from '../config/db.js';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  githubToken?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError('Invalid or expired authentication token', 401, 'TOKEN_EXPIRED');
    }

    if (isDbConnected()) {
      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (!user) {
        throw new AppError('User not found or account deactivated', 401, 'USER_NOT_FOUND');
      }

      req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        githubToken: user.githubToken,
      };
    } else {
      // In-memory / Mock development fallback
      req.user = {
        id: decoded.userId || 'dev-user-001',
        name: 'Dev Engineer',
        email: decoded.email || 'developer@devos.local',
      };
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

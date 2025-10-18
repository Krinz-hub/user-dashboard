import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/error.middleware.js';
import { isDbConnected } from '../config/db.js';

// In-memory fallback for testing / zero-database mode
const mockUsers = new Map<string, { id: string; name: string; email: string; passwordHash: string }>();

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        throw new AppError('An account with this email already exists', 409, 'EMAIL_EXISTS');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash,
      });

      const token = this.generateToken(user._id.toString(), user.email);

      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          preferences: user.preferences,
        },
        token,
      };
    }

    // Fallback store
    if (mockUsers.has(normalizedEmail)) {
      throw new AppError('An account with this email already exists', 409, 'EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = `mock-user-${Date.now()}`;
    mockUsers.set(normalizedEmail, { id, name, email: normalizedEmail, passwordHash });

    const token = this.generateToken(id, normalizedEmail);
    return {
      user: {
        id,
        name,
        email: normalizedEmail,
        preferences: { theme: 'dark', focusDurationMinutes: 25, breakDurationMinutes: 5 },
      },
      token,
    };
  }

  static async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      const token = this.generateToken(user._id.toString(), user.email);

      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          preferences: user.preferences,
          avatar: user.avatar,
        },
        token,
      };
    }

    // Fallback store
    const mockUser = mockUsers.get(normalizedEmail);
    if (!mockUser) {
      // Create dev engineer default account if testing
      if (normalizedEmail === 'developer@devos.local') {
        const id = 'dev-user-001';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        mockUsers.set(normalizedEmail, { id, name: 'Lead Developer', email: normalizedEmail, passwordHash });
        return {
          user: { id, name: 'Lead Developer', email: normalizedEmail, preferences: { theme: 'dark', focusDurationMinutes: 25, breakDurationMinutes: 5 } },
          token: this.generateToken(id, normalizedEmail),
        };
      }
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, mockUser.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const token = this.generateToken(mockUser.id, mockUser.email);
    return {
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        preferences: { theme: 'dark', focusDurationMinutes: 25, breakDurationMinutes: 5 },
      },
      token,
    };
  }

  static async getMe(userId: string) {
    if (isDbConnected()) {
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      return user;
    }

    return {
      _id: userId,
      name: 'Lead Developer',
      email: 'developer@devos.local',
      preferences: { theme: 'dark', focusDurationMinutes: 25, breakDurationMinutes: 5 },
      createdAt: new Date(),
    };
  }

  static generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }
}

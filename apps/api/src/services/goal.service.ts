import { Types } from 'mongoose';
import { Goal, IGoal, GoalPeriod, GoalStatus } from '../models/Goal.js';
import { AppError } from '../middleware/error.middleware.js';
import { isDbConnected } from '../config/db.js';

interface CreateGoalDTO {
  title: string;
  period: GoalPeriod;
  target: number;
  current?: number;
  deadline?: string | null;
}

interface UpdateGoalDTO extends Partial<CreateGoalDTO> {
  status?: GoalStatus;
}

const mockGoals: Array<Record<string, unknown>> = [
  {
    _id: 'goal-1',
    ownerId: 'dev-user-001',
    title: 'Ship DevOS MVP release',
    period: 'weekly',
    target: 1,
    current: 1,
    deadline: new Date(Date.now() + 2 * 86400000),
    status: 'completed',
    createdAt: new Date(Date.now() - 5 * 86400000),
  },
  {
    _id: 'goal-2',
    ownerId: 'dev-user-001',
    title: 'Complete 15 deep focus sessions',
    period: 'weekly',
    target: 15,
    current: 11,
    deadline: new Date(Date.now() + 3 * 86400000),
    status: 'active',
    createdAt: new Date(Date.now() - 4 * 86400000),
  },
  {
    _id: 'goal-3',
    ownerId: 'dev-user-001',
    title: 'Maintain 30-day GitHub commit streak',
    period: 'monthly',
    target: 30,
    current: 24,
    deadline: new Date(Date.now() + 6 * 86400000),
    status: 'active',
    createdAt: new Date(Date.now() - 24 * 86400000),
  },
];

export class GoalService {
  static async getGoals(ownerId: string, period?: string) {
    if (isDbConnected()) {
      const filter: Record<string, unknown> = {
        ownerId: new Types.ObjectId(ownerId),
      };
      if (period) filter.period = period;
      return Goal.find(filter).sort({ createdAt: -1 });
    }

    return mockGoals.filter((g) => {
      if (g.ownerId !== ownerId) return false;
      if (period && g.period !== period) return false;
      return true;
    });
  }

  static async createGoal(ownerId: string, data: CreateGoalDTO) {
    if (isDbConnected()) {
      return Goal.create({
        ...data,
        ownerId: new Types.ObjectId(ownerId),
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      });
    }

    const newGoal = {
      _id: `goal-${Date.now()}`,
      ownerId,
      title: data.title,
      period: data.period,
      target: data.target,
      current: data.current || 0,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGoals.unshift(newGoal);
    return newGoal;
  }

  static async updateGoal(ownerId: string, goalId: string, data: UpdateGoalDTO) {
    if (isDbConnected()) {
      const goal = await Goal.findOneAndUpdate(
        {
          _id: new Types.ObjectId(goalId),
          ownerId: new Types.ObjectId(ownerId),
        },
        { $set: data },
        { new: true }
      );
      if (!goal) throw new AppError('Goal not found', 404, 'GOAL_NOT_FOUND');
      return goal;
    }

    const index = mockGoals.findIndex((g) => g._id === goalId && g.ownerId === ownerId);
    if (index === -1) throw new AppError('Goal not found', 404, 'GOAL_NOT_FOUND');

    mockGoals[index] = { ...mockGoals[index], ...data, updatedAt: new Date() };
    return mockGoals[index];
  }
}

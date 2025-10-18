import { Types } from 'mongoose';
import { FocusSession, IFocusSession } from '../models/FocusSession.js';
import { Activity } from '../models/Activity.js';
import { AppError } from '../middleware/error.middleware.js';
import { isDbConnected } from '../config/db.js';

interface StartFocusDTO {
  projectId?: string | null;
  taskId?: string | null;
  duration?: number;
  notes?: string;
}

interface UpdateFocusDTO {
  status?: 'active' | 'completed' | 'interrupted';
  duration?: number;
  notes?: string;
  endedAt?: string;
}

const mockFocusSessions: Array<Record<string, unknown>> = [
  {
    _id: 'focus-1',
    ownerId: 'dev-user-001',
    projectId: 'proj-1',
    taskId: 'task-1',
    startedAt: new Date(Date.now() - 3 * 3600000),
    endedAt: new Date(Date.now() - 2.5 * 3600000),
    duration: 30,
    status: 'completed',
    notes: 'Token refinement and color contrast tests',
    createdAt: new Date(Date.now() - 3 * 3600000),
  },
  {
    _id: 'focus-2',
    ownerId: 'dev-user-001',
    projectId: 'proj-1',
    taskId: 'task-2',
    startedAt: new Date(Date.now() - 5 * 3600000),
    endedAt: new Date(Date.now() - 4.2 * 3600000),
    duration: 50,
    status: 'completed',
    notes: 'Mobile navigation drawer implementation',
    createdAt: new Date(Date.now() - 5 * 3600000),
  },
];

export class FocusService {
  static async getSessions(ownerId: string, limit = 20) {
    if (isDbConnected()) {
      return FocusSession.find({ ownerId: new Types.ObjectId(ownerId) })
        .sort({ startedAt: -1 })
        .limit(limit)
        .populate('projectId', 'name')
        .populate('taskId', 'title');
    }

    return mockFocusSessions
      .filter((s) => s.ownerId === ownerId)
      .slice(0, limit);
  }

  static async startSession(ownerId: string, data: StartFocusDTO) {
    if (isDbConnected()) {
      return FocusSession.create({
        ownerId: new Types.ObjectId(ownerId),
        projectId: data.projectId ? new Types.ObjectId(data.projectId) : undefined,
        taskId: data.taskId ? new Types.ObjectId(data.taskId) : undefined,
        duration: data.duration || 25,
        notes: data.notes || '',
        status: 'active',
        startedAt: new Date(),
      });
    }

    const session = {
      _id: `focus-${Date.now()}`,
      ownerId,
      projectId: data.projectId || undefined,
      taskId: data.taskId || undefined,
      duration: data.duration || 25,
      notes: data.notes || '',
      status: 'active',
      startedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockFocusSessions.unshift(session);
    return session;
  }

  static async updateSession(ownerId: string, sessionId: string, data: UpdateFocusDTO) {
    if (isDbConnected()) {
      const updatePayload: Record<string, unknown> = { ...data };
      if (data.status === 'completed' && !data.endedAt) {
        updatePayload.endedAt = new Date();
      }

      const session = await FocusSession.findOneAndUpdate(
        {
          _id: new Types.ObjectId(sessionId),
          ownerId: new Types.ObjectId(ownerId),
        },
        { $set: updatePayload },
        { new: true }
      );

      if (!session) throw new AppError('Focus session not found', 404, 'SESSION_NOT_FOUND');

      if (data.status === 'completed') {
        await Activity.create({
          ownerId: new Types.ObjectId(ownerId),
          source: 'focus',
          type: 'focus_completed',
          metadata: { duration: session.duration, sessionId: session._id },
        });
      }

      return session;
    }

    const index = mockFocusSessions.findIndex((s) => s._id === sessionId && s.ownerId === ownerId);
    if (index === -1) throw new AppError('Focus session not found', 404, 'SESSION_NOT_FOUND');

    mockFocusSessions[index] = {
      ...mockFocusSessions[index],
      ...data,
      endedAt: data.endedAt ? new Date(data.endedAt) : (data.status === 'completed' ? new Date() : undefined),
      updatedAt: new Date(),
    };

    return mockFocusSessions[index];
  }
}

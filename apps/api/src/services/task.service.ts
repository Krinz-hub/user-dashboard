import { Types } from 'mongoose';
import { Task, ITask, TaskStatus, TaskPriority } from '../models/Task.js';
import { Activity } from '../models/Activity.js';
import { AppError } from '../middleware/error.middleware.js';
import { isDbConnected } from '../config/db.js';

interface CreateTaskDTO {
  projectId?: string | null;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  labels?: string[];
  dueDate?: string | null;
}

interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  completedAt?: string | null;
}

const mockTasks: Array<Record<string, unknown>> = [
  {
    _id: 'task-1',
    ownerId: 'dev-user-001',
    projectId: 'proj-1',
    title: 'Design centralized semantic CSS design tokens',
    description: 'Implement dark/light HSL design tokens per docs/04-DESIGN-SYSTEM.md',
    status: 'Done',
    priority: 'High',
    labels: ['design-system', 'ui'],
    dueDate: new Date(Date.now() - 2 * 86400000),
    completedAt: new Date(Date.now() - 1 * 86400000),
    createdAt: new Date(Date.now() - 5 * 86400000),
    updatedAt: new Date(Date.now() - 1 * 86400000),
  },
  {
    _id: 'task-2',
    ownerId: 'dev-user-001',
    projectId: 'proj-1',
    title: 'Implement responsive application shell with mobile drawer',
    description: 'Provide desktop sidebar and mobile bottom navigation across all 8 breakpoints',
    status: 'In Progress',
    priority: 'Urgent',
    labels: ['frontend', 'responsive'],
    dueDate: new Date(Date.now() + 1 * 86400000),
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: 'task-3',
    ownerId: 'dev-user-001',
    projectId: 'proj-1',
    title: 'Set up GitHub OAuth integration & sync service',
    description: 'Sync repositories, commit summaries, and language distribution with caching',
    status: 'Todo',
    priority: 'Medium',
    labels: ['integration', 'github'],
    dueDate: new Date(Date.now() + 4 * 86400000),
    createdAt: new Date(Date.now() - 2 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: 'task-4',
    ownerId: 'dev-user-001',
    projectId: 'proj-2',
    title: 'Refactor atmospheric pressure interpolation algorithm',
    description: 'Improve numerical accuracy across elevation gradients',
    status: 'Backlog',
    priority: 'Low',
    labels: ['backend', 'algorithms'],
    createdAt: new Date(Date.now() - 8 * 86400000),
    updatedAt: new Date(),
  },
];

export class TaskService {
  static async getTasks(ownerId: string, projectId?: string, status?: string) {
    if (isDbConnected()) {
      const filter: Record<string, unknown> = {
        ownerId: new Types.ObjectId(ownerId),
      };
      if (projectId) filter.projectId = new Types.ObjectId(projectId);
      if (status) filter.status = status;

      return Task.find(filter).sort({ createdAt: -1 });
    }

    return mockTasks.filter((t) => {
      if (t.ownerId !== ownerId) return false;
      if (projectId && t.projectId !== projectId) return false;
      if (status && t.status !== status) return false;
      return true;
    });
  }

  static async getTaskById(ownerId: string, taskId: string) {
    if (isDbConnected()) {
      const task = await Task.findOne({
        _id: new Types.ObjectId(taskId),
        ownerId: new Types.ObjectId(ownerId),
      });
      if (!task) {
        throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
      }
      return task;
    }

    const task = mockTasks.find((t) => t._id === taskId && t.ownerId === ownerId);
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }
    return task;
  }

  static async createTask(ownerId: string, data: CreateTaskDTO) {
    const taskPayload = {
      ...data,
      ownerId: isDbConnected() ? new Types.ObjectId(ownerId) : ownerId,
      projectId: data.projectId ? (isDbConnected() ? new Types.ObjectId(data.projectId) : data.projectId) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };

    if (isDbConnected()) {
      const task = await Task.create(taskPayload);

      await Activity.create({
        ownerId: new Types.ObjectId(ownerId),
        source: 'devos',
        type: 'task_created',
        metadata: { taskId: task._id, taskTitle: task.title },
      });

      return task;
    }

    const newTask = {
      _id: `task-${Date.now()}`,
      ownerId,
      projectId: data.projectId || undefined,
      title: data.title,
      description: data.description || '',
      status: data.status || 'Todo',
      priority: data.priority || 'Medium',
      labels: data.labels || [],
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTasks.unshift(newTask);
    return newTask;
  }

  static async updateTask(ownerId: string, taskId: string, data: UpdateTaskDTO) {
    const isCompleted = data.status === 'Done';
    const updateData: Record<string, unknown> = { ...data };

    if (isCompleted && !data.completedAt) {
      updateData.completedAt = new Date();
    } else if (data.status && data.status !== 'Done') {
      updateData.completedAt = null;
    }

    if (isDbConnected()) {
      const task = await Task.findOneAndUpdate(
        {
          _id: new Types.ObjectId(taskId),
          ownerId: new Types.ObjectId(ownerId),
        },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!task) {
        throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
      }

      if (isCompleted) {
        await Activity.create({
          ownerId: new Types.ObjectId(ownerId),
          source: 'devos',
          type: 'task_completed',
          metadata: { taskId: task._id, taskTitle: task.title },
        });
      }

      return task;
    }

    const index = mockTasks.findIndex((t) => t._id === taskId && t.ownerId === ownerId);
    if (index === -1) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    mockTasks[index] = {
      ...mockTasks[index],
      ...updateData,
      updatedAt: new Date(),
    };

    return mockTasks[index];
  }

  static async deleteTask(ownerId: string, taskId: string) {
    if (isDbConnected()) {
      const task = await Task.findOneAndDelete({
        _id: new Types.ObjectId(taskId),
        ownerId: new Types.ObjectId(ownerId),
      });

      if (!task) {
        throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
      }

      return { deleted: true };
    }

    const index = mockTasks.findIndex((t) => t._id === taskId && t.ownerId === ownerId);
    if (index === -1) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    mockTasks.splice(index, 1);
    return { deleted: true };
  }
}

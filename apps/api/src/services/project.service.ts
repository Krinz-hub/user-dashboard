import { Types } from 'mongoose';
import { Project, IProject, ProjectStatus } from '../models/Project.js';
import { Activity } from '../models/Activity.js';
import { AppError } from '../middleware/error.middleware.js';
import { isDbConnected } from '../config/db.js';

interface CreateProjectDTO {
  name: string;
  description?: string;
  status?: ProjectStatus;
  progress?: number;
  repository?: string;
  technologies?: string[];
}

// In-memory fallback
const mockProjects: Array<Record<string, unknown>> = [
  {
    _id: 'proj-1',
    ownerId: 'dev-user-001',
    name: 'DevOS Platform',
    description: 'Personal Developer Operating System built for focus and visibility',
    status: 'Building',
    progress: 68,
    repository: 'https://github.com/developer/devos',
    technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind', 'MongoDB'],
    createdAt: new Date(Date.now() - 7 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: 'proj-2',
    ownerId: 'dev-user-001',
    name: 'Weather Mascot Reaction Engine',
    description: 'Dynamic character reaction engine based on real-time atmospheric data',
    status: 'Completed',
    progress: 100,
    repository: 'https://github.com/developer/mausam-engine',
    technologies: ['Python', 'FastAPI', 'PyTorch'],
    createdAt: new Date(Date.now() - 21 * 86400000),
    updatedAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    _id: 'proj-3',
    ownerId: 'dev-user-001',
    name: 'Realtime Heart Rate Telemetry',
    description: 'Bluetooth PPG/ECG sensor processing and telemetry pipeline',
    status: 'Planning',
    progress: 25,
    repository: '',
    technologies: ['C++', 'WebSockets', 'Go'],
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(),
  },
];

export class ProjectService {
  static async getProjects(ownerId: string, status?: string) {
    if (isDbConnected()) {
      const filter: Record<string, unknown> = {
        ownerId: new Types.ObjectId(ownerId),
      };
      if (status) {
        filter.status = status;
      } else {
        filter.status = { $ne: 'Archived' };
      }

      return Project.find(filter).sort({ updatedAt: -1 });
    }

    return mockProjects.filter((p) => {
      if (p.ownerId !== ownerId) return false;
      if (status) return p.status === status;
      return p.status !== 'Archived';
    });
  }

  static async getProjectById(ownerId: string, projectId: string) {
    if (isDbConnected()) {
      const project = await Project.findOne({
        _id: new Types.ObjectId(projectId),
        ownerId: new Types.ObjectId(ownerId),
      });

      if (!project) {
        throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      return project;
    }

    const project = mockProjects.find((p) => p._id === projectId && p.ownerId === ownerId);
    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }
    return project;
  }

  static async createProject(ownerId: string, data: CreateProjectDTO) {
    if (isDbConnected()) {
      const project = await Project.create({
        ...data,
        ownerId: new Types.ObjectId(ownerId),
      });

      await Activity.create({
        ownerId: new Types.ObjectId(ownerId),
        source: 'devos',
        type: 'project_created',
        metadata: { projectId: project._id, projectName: project.name },
      });

      return project;
    }

    const newProject = {
      _id: `proj-${Date.now()}`,
      ownerId,
      name: data.name,
      description: data.description || '',
      status: data.status || 'Planning',
      progress: data.progress || 0,
      repository: data.repository || '',
      technologies: data.technologies || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjects.unshift(newProject);
    return newProject;
  }

  static async updateProject(ownerId: string, projectId: string, data: Partial<CreateProjectDTO>) {
    if (isDbConnected()) {
      const project = await Project.findOneAndUpdate(
        {
          _id: new Types.ObjectId(projectId),
          ownerId: new Types.ObjectId(ownerId),
        },
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!project) {
        throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      if (data.status) {
        await Activity.create({
          ownerId: new Types.ObjectId(ownerId),
          source: 'devos',
          type: 'project_status_updated',
          metadata: { projectId: project._id, status: data.status },
        });
      }

      return project;
    }

    const index = mockProjects.findIndex((p) => p._id === projectId && p.ownerId === ownerId);
    if (index === -1) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    mockProjects[index] = {
      ...mockProjects[index],
      ...data,
      updatedAt: new Date(),
    };

    return mockProjects[index];
  }

  static async deleteProject(ownerId: string, projectId: string) {
    if (isDbConnected()) {
      // Soft-delete / Archive
      const project = await Project.findOneAndUpdate(
        {
          _id: new Types.ObjectId(projectId),
          ownerId: new Types.ObjectId(ownerId),
        },
        { $set: { status: 'Archived', archivedAt: new Date() } },
        { new: true }
      );

      if (!project) {
        throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      return { archived: true };
    }

    const index = mockProjects.findIndex((p) => p._id === projectId && p.ownerId === ownerId);
    if (index === -1) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    mockProjects[index].status = 'Archived';
    mockProjects[index].archivedAt = new Date();
    return { archived: true };
  }
}

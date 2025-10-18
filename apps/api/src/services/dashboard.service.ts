import { Types } from 'mongoose';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { FocusSession } from '../models/FocusSession.js';
import { Activity } from '../models/Activity.js';
import { Goal } from '../models/Goal.js';
import { isDbConnected } from '../config/db.js';

export class DashboardService {
  static async getDashboard(ownerId: string) {
    if (isDbConnected()) {
      const userObjectId = new Types.ObjectId(ownerId);

      const [
        activeProjectsCount,
        openTasksCount,
        recentFocusSessions,
        recentActivity,
        activeProjects,
        upcomingTasks,
        activeGoals,
      ] = await Promise.all([
        Project.countDocuments({ ownerId: userObjectId, status: 'Building' }),
        Task.countDocuments({ ownerId: userObjectId, status: { $in: ['Todo', 'In Progress'] } }),
        FocusSession.find({ ownerId: userObjectId, status: 'completed' }),
        Activity.find({ ownerId: userObjectId }).sort({ timestamp: -1 }).limit(6),
        Project.find({ ownerId: userObjectId, status: { $in: ['Building', 'Planning'] } })
          .sort({ updatedAt: -1 })
          .limit(4),
        Task.find({ ownerId: userObjectId, status: { $in: ['Todo', 'In Progress'] } })
          .sort({ priority: -1, createdAt: -1 })
          .limit(5),
        Goal.find({ ownerId: userObjectId, status: 'active' }).limit(3),
      ]);

      const totalFocusMinutes = recentFocusSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const focusHours = (totalFocusMinutes / 60).toFixed(1);

      return {
        focus: {
          currentTask: upcomingTasks[0]?.title || 'Continue DevOS core features',
          currentProject: activeProjects[0]?.name || 'DevOS Platform',
          projectId: activeProjects[0]?._id,
          taskId: upcomingTasks[0]?._id,
        },
        metrics: [
          { label: 'Active Projects', value: activeProjectsCount || 1, change: '+1 this week' },
          { label: 'Open Tasks', value: openTasksCount || 3, change: '2 in progress' },
          { label: 'Focus Time', value: `${focusHours}h`, change: 'Past 7 days' },
          { label: 'GitHub Activity', value: '48 commits', change: '18 day streak' },
        ],
        activeProjects: activeProjects.map((p) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          status: p.status,
          progress: p.progress,
          technologies: p.technologies,
        })),
        upcomingTasks: upcomingTasks.map((t) => ({
          id: t._id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate,
        })),
        recentActivity: recentActivity.map((a) => ({
          id: a._id,
          source: a.source,
          type: a.type,
          metadata: a.metadata,
          timestamp: a.timestamp,
        })),
        goals: activeGoals.map((g) => ({
          id: g._id,
          title: g.title,
          period: g.period,
          target: g.target,
          current: g.current,
        })),
      };
    }

    // In-memory fallback
    return {
      focus: {
        currentTask: 'Implement responsive application shell with mobile drawer',
        currentProject: 'DevOS Platform',
        projectId: 'proj-1',
        taskId: 'task-2',
      },
      metrics: [
        { label: 'Active Projects', value: 2, change: '+1 this month' },
        { label: 'Open Tasks', value: 2, change: '1 urgent priority' },
        { label: 'Focus Time', value: '14.2h', change: 'Past 7 days' },
        { label: 'GitHub Activity', value: '124 commits', change: '24 day streak' },
      ],
      activeProjects: [
        {
          id: 'proj-1',
          name: 'DevOS Platform',
          description: 'Personal Developer Operating System built for focus and visibility',
          status: 'Building',
          progress: 68,
          technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind'],
        },
        {
          id: 'proj-3',
          name: 'Realtime Heart Rate Telemetry',
          description: 'Bluetooth PPG/ECG sensor processing and telemetry pipeline',
          status: 'Planning',
          progress: 25,
          technologies: ['C++', 'WebSockets'],
        },
      ],
      upcomingTasks: [
        {
          id: 'task-2',
          title: 'Implement responsive application shell with mobile drawer',
          status: 'In Progress',
          priority: 'Urgent',
          dueDate: new Date(Date.now() + 86400000),
        },
        {
          id: 'task-3',
          title: 'Set up GitHub OAuth integration & sync service',
          status: 'Todo',
          priority: 'Medium',
          dueDate: new Date(Date.now() + 4 * 86400000),
        },
      ],
      recentActivity: [
        {
          id: 'act-1',
          source: 'devos',
          type: 'task_completed',
          metadata: { taskTitle: 'Design centralized semantic CSS design tokens' },
          timestamp: new Date(Date.now() - 3600000 * 2),
        },
        {
          id: 'act-2',
          source: 'github',
          type: 'push',
          metadata: { repo: 'devos', commitCount: 3, message: 'feat: add task service and validation' },
          timestamp: new Date(Date.now() - 3600000 * 4),
        },
        {
          id: 'act-3',
          source: 'focus',
          type: 'focus_completed',
          metadata: { duration: 50 },
          timestamp: new Date(Date.now() - 3600000 * 6),
        },
      ],
      goals: [
        { id: 'goal-1', title: 'Complete 15 deep focus sessions', period: 'weekly', target: 15, current: 11 },
        { id: 'goal-2', title: 'Maintain 30-day GitHub commit streak', period: 'monthly', target: 30, current: 24 },
      ],
    };
  }
}

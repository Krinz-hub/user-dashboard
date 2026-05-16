import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Header } from '@/components/nav/Header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatRelativeTime } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Github,
  Play,
  ArrowRight,
  TrendingUp,
  CircleDot,
} from 'lucide-react';

interface DashboardData {
  focus: {
    currentTask: string;
    currentProject: string;
    projectId?: string;
    taskId?: string;
  };
  metrics: Array<{ label: string; value: string | number; change: string }>;
  activeProjects: Array<{
    id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    technologies: string[];
  }>;
  upcomingTasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
  }>;
  recentActivity: Array<{
    id: string;
    source: string;
    type: string;
    metadata: Record<string, any>;
    timestamp: string;
  }>;
  goals: Array<{
    id: string;
    title: string;
    period: string;
    target: number;
    current: number;
  }>;
}

export function DashboardPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('/dashboard'),
  });

  if (isLoading) {
    return (
      <div>
        <Header title="Overview" context="Developer Operating System" />
        <div className="p-4 md:p-8 space-y-6">
          <Skeleton className="h-28 w-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <Header title="Overview" />
        <div className="p-4 md:p-8">
          <ErrorState
            title="Couldn't load dashboard"
            message={error instanceof Error ? error.message : 'Please check your connection and retry.'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  const metricIcons = [FolderGit2, CheckCircle2, Clock, Github];

  return (
    <div className="animate-in fade-in duration-200">
      <Header
        title="Overview"
        context="What am I working on? How is it going? What next?"
        actionLabel="New Project"
        onAction={() => navigate('/projects?new=1')}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* 1. CURRENT FOCUS CARD */}
        <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-r from-card via-card to-primary/5 p-5 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">Current Focus</span>
                <span className="text-xs text-muted-foreground">• {data.focus.currentProject}</span>
              </div>
              <h2 className="text-base md:text-lg font-semibold text-foreground tracking-tight">
                {data.focus.currentTask}
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => navigate('/focus')}
                className="gap-1.5 font-medium shadow-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Resume Focus</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tasks')}
              >
                Tasks
              </Button>
            </div>
          </div>
        </div>

        {/* 2. FOUR KEY METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {data.metrics.map((metric, idx) => {
            const Icon = metricIcons[idx % metricIcons.length];
            return (
              <Card key={metric.label} className="p-4 flex flex-col justify-between hover:border-border/80 transition-colors">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">{metric.label}</span>
                  <Icon className="h-4 w-4 opacity-75" />
                </div>
                <div className="mt-3">
                  <div className="text-xl md:text-2xl font-semibold tracking-tight text-foreground font-mono">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span>{metric.change}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 3. CORE GRIDS: ACTIVE PROJECTS + UPCOMING TASKS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects (2 cols on large) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Active Projects</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="text-xs text-muted-foreground gap-1 hover:text-foreground"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {data.activeProjects.slice(0, 4).map((project) => (
                <Card
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="p-4 cursor-pointer hover:border-primary/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                        {project.name}
                      </h4>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {project.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {project.description || 'No description added.'}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Actions & Goals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Upcoming Actions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tasks')}
                className="text-xs text-muted-foreground gap-1 hover:text-foreground"
              >
                Board <ArrowRight className="h-3 w-3" />
              </Button>
            </div>

            <Card className="divide-y divide-border/60">
              {data.upcomingTasks.map((task) => (
                <div key={task.id} className="p-3.5 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                  <CircleDot className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          task.priority === 'Urgent'
                            ? 'danger'
                            : task.priority === 'High'
                            ? 'warning'
                            : 'secondary'
                        }
                        className="text-[9px] px-1.5 py-0"
                      >
                        {task.priority}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{task.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>

        {/* 4. RECENT ACTIVITY STREAM */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Activity</h3>
          <Card className="divide-y divide-border/60">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    {activity.source === 'github' ? (
                      <Github className="h-3.5 w-3.5" />
                    ) : activity.source === 'focus' ? (
                      <Clock className="h-3.5 w-3.5" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className="text-foreground truncate">
                    {activity.type === 'task_completed' &&
                      `Completed task: ${activity.metadata.taskTitle || 'Design tokens'}`}
                    {activity.type === 'push' &&
                      `Pushed ${activity.metadata.commitCount || 1} commit(s) to ${activity.metadata.repo || 'devos'}`}
                    {activity.type === 'focus_completed' &&
                      `Completed ${activity.metadata.duration || 25}-minute focus block`}
                    {!['task_completed', 'push', 'focus_completed'].includes(activity.type) &&
                      activity.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0 ml-3 font-mono">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

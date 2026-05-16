import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Header } from '@/components/nav/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { TabsList, TabTrigger } from '@/components/ui/Tabs';
import { ProjectModal } from './ProjectModal';
import {
  ArrowLeft,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  CircleDot,
  Calendar,
  Layers,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'milestones' | 'activity'>('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: projectData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get<{ project: any }>(`/projects/${id}`),
    enabled: !!id,
  });

  const { data: tasksData } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => api.get<{ tasks: any[] }>(`/tasks?projectId=${id}`),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (updated: any) => api.patch(`/projects/${id}`, updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/projects');
    },
  });

  if (isLoading) {
    return (
      <div>
        <Header title="Project Details" />
        <div className="p-4 md:p-8 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !projectData?.project) {
    return (
      <div>
        <Header title="Project Details" />
        <div className="p-4 md:p-8">
          <ErrorState
            title="Couldn't load project"
            message={error instanceof Error ? error.message : 'The project may not exist.'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  const project = projectData.project;
  const projectTasks = tasksData?.tasks || [];

  return (
    <div className="animate-in fade-in duration-200">
      <Header
        title={project.name}
        context={`Status: ${project.status} • Progress: ${project.progress}%`}
        actionLabel="Edit Project"
        onAction={() => setIsEditOpen(true)}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Navigation Breadcrumb Back */}
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
        </button>

        {/* Project Header Banner */}
        <div className="rounded-lg border border-border bg-card p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{project.name}</h2>
                <Badge
                  variant={
                    project.status === 'Building'
                      ? 'default'
                      : project.status === 'Completed'
                      ? 'success'
                      : 'secondary'
                  }
                >
                  {project.status}
                </Badge>
              </div>
              <p className="mt-1.5 text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {project.description || 'No description provided for this project.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Repository
                </a>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Archive this project?')) {
                    deleteMutation.mutate();
                  }
                }}
                className="text-xs text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Archive
              </Button>
            </div>
          </div>

          {/* Progress Bar & Tech */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>Milestone Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.technologies.map((tech: string) => (
                <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border/60 pb-1">
          <TabsList>
            <TabTrigger active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
              Overview
            </TabTrigger>
            <TabTrigger active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>
              Tasks ({projectTasks.length})
            </TabTrigger>
            <TabTrigger active={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')}>
              Milestones
            </TabTrigger>
            <TabTrigger active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
              Activity
            </TabTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-mono">{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-mono">{formatDate(project.updatedAt)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Current Status</span>
                  <span className="font-medium text-foreground">{project.status}</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next Action</h4>
              {projectTasks.find((t) => t.status !== 'Done') ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">
                    {projectTasks.find((t) => t.status !== 'Done')?.title}
                  </p>
                  <Button size="sm" onClick={() => navigate('/focus')} className="text-xs">
                    Start Focus Session
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">All active tasks completed for this project.</p>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {projectTasks.length === 0 ? (
              <EmptyState
                title="No tasks linked to this project"
                description="Create tasks in the Tasks view to track granular implementation items."
                actionLabel="Go to Tasks"
                onAction={() => navigate('/tasks')}
              />
            ) : (
              <Card className="divide-y divide-border/60">
                {projectTasks.map((t) => (
                  <div key={t._id} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CircleDot className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-medium truncate">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {t.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}

        {activeTab === 'milestones' && (
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Planned Milestones
            </h4>
            <div className="space-y-3">
              {[
                { name: 'v0.1 — Core Architecture & Schemas', completed: true },
                { name: 'v0.2 — Feature Layer & API Integration', completed: project.progress >= 50 },
                { name: 'v0.3 — Performance, Testing & Polishing', completed: project.progress >= 100 },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3 text-xs">
                  <CheckCircle2
                    className={`h-4 w-4 ${m.completed ? 'text-success' : 'text-muted-foreground/40'}`}
                  />
                  <span className={m.completed ? 'text-foreground' : 'text-muted-foreground'}>{m.name}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card className="p-5 text-xs text-muted-foreground">
            Project activity stream is synchronized with global workspace events.
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      <ProjectModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={project}
        onSubmit={async (updated) => {
          await updateMutation.mutateAsync(updated);
        }}
      />
    </div>
  );
}

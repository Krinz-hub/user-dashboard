import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Header } from '@/components/nav/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { TaskModal } from './TaskModal';
import {
  CheckSquare,
  Plus,
  Circle,
  Clock,
  CheckCircle2,
  ListFilter,
  Columns3,
  List,
  Search,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface Task {
  _id: string;
  projectId?: string;
  title: string;
  description?: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  labels: string[];
  dueDate?: string;
}

export function TasksPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tasksData, isLoading, isError, error, refetch } = useQuery<{ tasks: Task[] }>({
    queryKey: ['tasks'],
    queryFn: () => api.get<{ tasks: Task[] }>('/tasks'),
  });

  const { data: projectsData } = useQuery<{ projects: Array<{ _id: string; name: string }> }>({
    queryKey: ['projects'],
    queryFn: () => api.get<{ projects: any[] }>('/projects'),
  });

  const createMutation = useMutation({
    mutationFn: (newTask: any) => api.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.patch(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const allTasks = tasksData?.tasks || [];
  const filteredTasks = allTasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
  });

  const columns: Array<{ id: Task['status']; label: string; icon: any }> = [
    { id: 'Backlog', label: 'Backlog', icon: Circle },
    { id: 'Todo', label: 'To Do', icon: Circle },
    { id: 'In Progress', label: 'In Progress', icon: Clock },
    { id: 'Done', label: 'Done', icon: CheckCircle2 },
  ];

  const moveStatus = (task: Task, direction: 'next' | 'prev') => {
    const order: Task['status'][] = ['Backlog', 'Todo', 'In Progress', 'Done'];
    const currIndex = order.indexOf(task.status);
    const newIndex = direction === 'next' ? currIndex + 1 : currIndex - 1;
    if (newIndex >= 0 && newIndex < order.length) {
      updateMutation.mutate({ id: task._id, data: { status: order[newIndex] } });
    }
  };

  return (
    <div className="animate-in fade-in duration-200">
      <Header
        title="Tasks"
        context="Active issues and execution backlog"
        actionLabel="New Task"
        onAction={() => {
          setSelectedTask(null);
          setIsModalOpen(true);
        }}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Controls Bar: Search & View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-card/60 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setViewMode('board')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'board' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Board View"
              >
                <Columns3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-80 w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <ErrorState
            title="Couldn't load tasks"
            message={error instanceof Error ? error.message : 'Please check your connection.'}
            onRetry={() => refetch()}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && allTasks.length === 0 && (
          <EmptyState
            icon={<CheckSquare className="h-8 w-8 text-muted-foreground/60" />}
            title="No tasks in your workspace"
            description="Create tasks to organize sprints, track bugs, and streamline your next focus sessions."
            actionLabel="Create your first task"
            onAction={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
          />
        )}

        {/* Board View */}
        {!isLoading && !isError && allTasks.length > 0 && viewMode === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id);
              const ColIcon = col.icon;
              return (
                <div
                  key={col.id}
                  className="rounded-lg border border-border/80 bg-card/40 p-3 space-y-3 min-h-[380px]"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <ColIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-foreground tracking-tight">{col.label}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">({colTasks.length})</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {colTasks.map((task) => (
                      <Card
                        key={task._id}
                        className="p-3.5 hover:border-primary/40 transition-all space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() => {
                              setSelectedTask(task);
                              setIsModalOpen(true);
                            }}
                            className="text-xs font-medium text-foreground hover:text-primary cursor-pointer leading-snug line-clamp-2"
                          >
                            {task.title}
                          </h4>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
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

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {col.id !== 'Backlog' && (
                              <button
                                onClick={() => moveStatus(task, 'prev')}
                                className="p-0.5 rounded text-muted-foreground hover:text-foreground"
                                title="Move left"
                              >
                                <ChevronLeft className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {col.id !== 'Done' && (
                              <button
                                onClick={() => moveStatus(task, 'next')}
                                className="p-0.5 rounded text-muted-foreground hover:text-foreground"
                                title="Move right"
                              >
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}

                    {colTasks.length === 0 && (
                      <div className="py-8 text-center text-[11px] text-muted-foreground/60">
                        No tasks in {col.label.toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {!isLoading && !isError && allTasks.length > 0 && viewMode === 'list' && (
          <Card className="divide-y divide-border/60">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="p-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: task._id,
                        data: { status: task.status === 'Done' ? 'Todo' : 'Done' },
                      })
                    }
                    className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {task.status === 'Done' ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>
                  <span
                    onClick={() => {
                      setSelectedTask(task);
                      setIsModalOpen(true);
                    }}
                    className={`font-medium cursor-pointer truncate ${
                      task.status === 'Done' ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <Badge variant="outline" className="text-[10px]">
                    {task.status}
                  </Badge>
                  <Badge
                    variant={
                      task.priority === 'Urgent'
                        ? 'danger'
                        : task.priority === 'High'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="text-[10px]"
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        initialData={selectedTask}
        projects={projectsData?.projects || []}
        onSubmit={async (data) => {
          if (selectedTask) {
            await updateMutation.mutateAsync({ id: selectedTask._id, data });
          } else {
            await createMutation.mutateAsync(data);
          }
        }}
      />
    </div>
  );
}
